/* ================================================================
   JOB BOARD PLATFORM - DATABASE SCHEMA (PostgreSQL)
   Production-hardened version
   ================================================================
   Design notes / assumptions:
   - No foreign key constraints are declared, per requirement.
     Referencing ID columns are plain BIGINT and are only linked
     logically (see inline comments); integrity is enforced at the
     application/API layer. Every referencing column is indexed for
     join performance regardless.
   - Two separate account tables (clients, employers) since their
     profile fields differ significantly. Each has its own login
     (email + password_hash).
   - All uploaded files go through ONE "documents" table. Every row
     gets a system-generated UUID (stored_file_name) that becomes
     the actual name of the file on disk, so two uploads sharing the
     same original file name (e.g. two people uploading "CV.pdf")
     can NEVER collide or overwrite each other. The user's original
     file name is preserved separately for display/download.
   - All timestamps use TIMESTAMPTZ (timezone-aware) - required for
     correctness once the app/DB/users span timezones.
   - updated_at columns are maintained automatically via triggers,
     not left to application code discipline.
   - Format-validating CHECK constraints (ID number, phone, postal
     code, salary range, etc.) catch bad data at the DB boundary
     regardless of what the API layer does.
   - Primary keys use BIGSERIAL to avoid any future 32-bit overflow
     risk at scale.
   ================================================================ */

/* ================================================================
   EXTENSIONS
   ================================================================ */

-- Case-insensitive text type, used for email columns so
-- "John@x.com" and "john@x.com" are treated as duplicates.
CREATE EXTENSION IF NOT EXISTS citext;

-- Provides gen_random_uuid(). Built into PostgreSQL core since v13;
-- this extension is a safe no-op on 13+ and required on older versions.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

/* ================================================================
   REUSABLE TRIGGER FUNCTION: auto-maintain updated_at
   ================================================================ */

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

/* ================================================================
   LOOKUP TABLES
   ================================================================ */

CREATE TABLE provinces (
    province_id     BIGSERIAL PRIMARY KEY,
    province_name   VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE categories (
    category_id     BIGSERIAL PRIMARY KEY,
    category_name   VARCHAR(100) NOT NULL UNIQUE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE
);

/* ================================================================
   CLIENTS (JOB SEEKERS)
   ================================================================ */

CREATE TABLE clients (
    client_id       BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    surname         VARCHAR(100) NOT NULL,
    id_number       VARCHAR(20)  NOT NULL UNIQUE
        CHECK (id_number ~ '^[0-9]{13}$'),          -- SA ID number: 13 digits
    date_of_birth   DATE NOT NULL
        CHECK (date_of_birth <= CURRENT_DATE - INTERVAL '16 years'),
    gender          VARCHAR(30) NOT NULL,
    email           CITEXT NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    phone_number    VARCHAR(20) NOT NULL
        CHECK (phone_number ~ '^\+?[0-9]{9,15}$'),

    province_id     BIGINT NOT NULL,   -- logical FK -> provinces.province_id
    town            VARCHAR(100) NOT NULL,
    street_name     VARCHAR(200) NOT NULL,
    suburb          VARCHAR(100) NOT NULL,
    postal_code     VARCHAR(10) NOT NULL
        CHECK (postal_code ~ '^[0-9]{4}$'),

    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_clients_province ON clients(province_id);

CREATE TRIGGER set_updated_at_clients
    BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Many-to-many: a client can pick several career interests
CREATE TABLE client_interests (
    client_id       BIGINT NOT NULL,   -- logical FK -> clients.client_id
    category_id     BIGINT NOT NULL,   -- logical FK -> categories.category_id
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (client_id, category_id)
);

/* ================================================================
   EMPLOYERS (ADMINS)
   ================================================================ */

CREATE TABLE employers (
    employer_id     BIGSERIAL PRIMARY KEY,
    company_name    VARCHAR(200) NOT NULL,
    contact_person  VARCHAR(150) NOT NULL,
    hr_email        CITEXT NOT NULL,
    email           CITEXT NOT NULL UNIQUE,   -- login email
    password_hash   VARCHAR(255) NOT NULL,
    phone_number    VARCHAR(20) NOT NULL
        CHECK (phone_number ~ '^\+?[0-9]{9,15}$'),
    industry_type   VARCHAR(100) NOT NULL,

    province_id     BIGINT NOT NULL,   -- logical FK -> provinces.province_id
    town            VARCHAR(100) NOT NULL,
    street_name     VARCHAR(200),
    suburb          VARCHAR(100),
    postal_code     VARCHAR(10)
        CHECK (postal_code IS NULL OR postal_code ~ '^[0-9]{4}$'),

    verification_status VARCHAR(20) NOT NULL DEFAULT 'Pending'
        CHECK (verification_status IN ('Pending','Verified','Rejected')),

    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_employers_province ON employers(province_id);

CREATE TRIGGER set_updated_at_employers
    BEFORE UPDATE ON employers
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

/* ================================================================
   JOBS
   ================================================================ */

CREATE TABLE jobs (
    job_id              BIGSERIAL PRIMARY KEY,
    employer_id         BIGINT NOT NULL,   -- logical FK -> employers.employer_id
    job_title            VARCHAR(200) NOT NULL,
    department           VARCHAR(150) NOT NULL,
    description           TEXT NOT NULL,
    category_id           BIGINT NOT NULL,   -- logical FK -> categories.category_id

    salary_min             NUMERIC(12,2) CHECK (salary_min IS NULL OR salary_min >= 0),
    salary_max             NUMERIC(12,2) CHECK (salary_max IS NULL OR salary_max >= 0),

    province_id             BIGINT NOT NULL,   -- logical FK -> provinces.province_id
    town                    VARCHAR(100) NOT NULL,

    application_start_date  DATE NOT NULL,
    application_end_date    DATE NOT NULL,

    status                  VARCHAR(20) NOT NULL DEFAULT 'Open'
        CHECK (status IN ('Draft','Open','Closed','Cancelled')),

    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT ck_jobs_date_range CHECK (application_end_date >= application_start_date),
    CONSTRAINT ck_jobs_salary_range CHECK (
        salary_min IS NULL OR salary_max IS NULL OR salary_max >= salary_min
    )
);

CREATE INDEX ix_jobs_employer      ON jobs(employer_id);
CREATE INDEX ix_jobs_category      ON jobs(category_id);
CREATE INDEX ix_jobs_status        ON jobs(status);
CREATE INDEX ix_jobs_province_town ON jobs(province_id, town);
-- Common search pattern: open jobs in a category, most recent first
CREATE INDEX ix_jobs_search ON jobs(status, category_id, province_id) WHERE status = 'Open';

CREATE TRIGGER set_updated_at_jobs
    BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Free-text skill tags per job (used for matching/ranking)
CREATE TABLE job_skill_tags (
    job_skill_tag_id BIGSERIAL PRIMARY KEY,
    job_id          BIGINT NOT NULL,   -- logical FK -> jobs.job_id
    skill_name      VARCHAR(100) NOT NULL
);

CREATE INDEX ix_job_skill_tags_job ON job_skill_tags(job_id);

-- What documents the employer requires for this job (e.g. CV, ID copy, certificate)
CREATE TABLE job_required_documents (
    job_required_document_id BIGSERIAL PRIMARY KEY,
    job_id          BIGINT NOT NULL,   -- logical FK -> jobs.job_id
    document_type   VARCHAR(100) NOT NULL,
    is_mandatory    BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX ix_job_required_documents_job ON job_required_documents(job_id);

/* ================================================================
   APPLICATIONS
   ================================================================ */

CREATE TABLE applications (
    application_id  BIGSERIAL PRIMARY KEY,
    job_id          BIGINT NOT NULL,   -- logical FK -> jobs.job_id
    client_id       BIGINT NOT NULL,   -- logical FK -> clients.client_id

    status          VARCHAR(20) NOT NULL DEFAULT 'Pending'
        CHECK (status IN ('Pending','Reviewed','Accepted','Declined','Withdrawn')),

    match_percentage NUMERIC(5,2)
        CHECK (match_percentage IS NULL OR (match_percentage >= 0 AND match_percentage <= 100)),

    applied_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    withdrawn_at    TIMESTAMPTZ,

    CONSTRAINT uq_applications_job_client UNIQUE (job_id, client_id)  -- one application per job per client
);

CREATE INDEX ix_applications_job    ON applications(job_id);
CREATE INDEX ix_applications_client ON applications(client_id);
CREATE INDEX ix_applications_status ON applications(status);
-- Common dashboard pattern: a client's applications by status
CREATE INDEX ix_applications_client_status ON applications(client_id, status);

CREATE TRIGGER set_updated_at_applications
    BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Audit trail for status changes (drives "track applications")
CREATE TABLE application_status_history (
    status_history_id BIGSERIAL PRIMARY KEY,
    application_id  BIGINT NOT NULL,   -- logical FK -> applications.application_id
    old_status      VARCHAR(20),
    new_status      VARCHAR(20) NOT NULL,
    changed_by      VARCHAR(20) NOT NULL CHECK (changed_by IN ('Client','Employer','System')),
    changed_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_app_status_history_app ON application_status_history(application_id);

/* ================================================================
   DOCUMENTS
   ================================================================
   Single table for every uploaded file: a client's resume/video
   intro, and the supporting documents attached to a specific
   application.

   Collision safety: stored_file_name is a server-generated UUID
   that becomes the file's actual name on disk. Two uploads with
   the same original_file_name (e.g. "CV.pdf" from two different
   applicants) get different stored_file_name values, so neither
   can ever overwrite the other. file_path is additionally UNIQUE
   at the database level as a second guarantee. original_file_name
   is kept so the app can show/download the file under the name
   the user originally gave it.
   ================================================================ */

CREATE TABLE documents (
    document_id         BIGSERIAL PRIMARY KEY,

    doc_scope            VARCHAR(20) NOT NULL
        CHECK (doc_scope IN ('ClientProfile','Application')),

    client_id             BIGINT,     -- logical FK -> clients.client_id (set when doc_scope = 'ClientProfile')
    application_id         BIGINT,     -- logical FK -> applications.application_id (set when doc_scope = 'Application')

    document_type           VARCHAR(50) NOT NULL,  -- Resume, VideoIntro, ID Copy, Certificate, CV, Other
    original_file_name       VARCHAR(255) NOT NULL, -- name as uploaded by the user (for display/download)
    stored_file_name          UUID NOT NULL DEFAULT gen_random_uuid(), -- actual file name on disk - always unique
    file_extension              VARCHAR(20) NOT NULL,  -- e.g. 'pdf', 'docx', 'jpg' (no leading dot)
    file_path                    VARCHAR(500) NOT NULL, -- relative path on the server's upload folder
    file_size_bytes                BIGINT CHECK (file_size_bytes IS NULL OR file_size_bytes >= 0),
    mime_type                       VARCHAR(100),

    uploaded_at                      TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT uq_documents_stored_file_name UNIQUE (stored_file_name),
    CONSTRAINT uq_documents_file_path UNIQUE (file_path),
    CONSTRAINT ck_documents_scope_consistency CHECK (
        (doc_scope = 'ClientProfile' AND client_id IS NOT NULL AND application_id IS NULL)
        OR
        (doc_scope = 'Application' AND application_id IS NOT NULL)
    )
);

CREATE INDEX ix_documents_client      ON documents(client_id);
CREATE INDEX ix_documents_application ON documents(application_id);

/* ================================================================
   INTERVIEWS (created when an application is Accepted)
   ================================================================ */

CREATE TABLE interviews (
    interview_id    BIGSERIAL PRIMARY KEY,
    application_id  BIGINT NOT NULL UNIQUE,   -- logical FK -> applications.application_id
    interview_date  DATE NOT NULL,
    interview_time  TIME NOT NULL,
    location        VARCHAR(300) NOT NULL,  -- physical address or meeting link
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

/* ================================================================
   NOTIFICATIONS (split per account type - no polymorphic lookups)
   ================================================================ */

CREATE TABLE client_notifications (
    client_notification_id BIGSERIAL PRIMARY KEY,
    client_id       BIGINT NOT NULL,   -- logical FK -> clients.client_id
    message         VARCHAR(500) NOT NULL,
    type            VARCHAR(30) NOT NULL,   -- ApplicationStatus, InterviewScheduled, etc.
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_client_notifications_client ON client_notifications(client_id, is_read);

CREATE TABLE employer_notifications (
    employer_notification_id BIGSERIAL PRIMARY KEY,
    employer_id     BIGINT NOT NULL,   -- logical FK -> employers.employer_id
    message         VARCHAR(500) NOT NULL,
    type            VARCHAR(30) NOT NULL,   -- NewApplication, etc.
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_employer_notifications_employer ON employer_notifications(employer_id, is_read);

/* ================================================================
   EMAIL LOG (audit of outbound emails - confirmations, decisions)
   ================================================================ */

CREATE TABLE email_logs (
    email_log_id    BIGSERIAL PRIMARY KEY,
    recipient_email CITEXT NOT NULL,
    subject         VARCHAR(300) NOT NULL,
    template_type   VARCHAR(50) NOT NULL,  -- ApplicationConfirmation, Accepted, Declined, InterviewScheduled
    status          VARCHAR(20) NOT NULL DEFAULT 'Sent'
        CHECK (status IN ('Sent','Failed','Pending')),
    sent_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

/* ================================================================
   OTP VERIFICATIONS
   ================================================================
   Used for the forgot-password flow: request-otp generates and
   emails a code, verify-otp checks it, reset-password consumes the
   resulting short-lived token. Reusable later for email verification
   by adding another account_type/purpose if needed.
   ================================================================ */

CREATE TABLE otp_verifications (
    otp_id          BIGSERIAL PRIMARY KEY,
    account_type    VARCHAR(20) NOT NULL CHECK (account_type IN ('Client','Employer')),
    account_id      BIGINT NOT NULL,   -- logical FK -> clients.client_id or employers.employer_id, depending on account_type
    otp_hash        VARCHAR(255) NOT NULL,  -- OTP is hashed the same way as passwords - never stored in plain text
    attempts        SMALLINT NOT NULL DEFAULT 0,
    is_used         BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_otp_verifications_account ON otp_verifications(account_type, account_id, is_used);

/* ================================================================
   SEED DATA
   ================================================================ */

INSERT INTO provinces (province_name) VALUES
('Eastern Cape'),('Free State'),('Gauteng'),('KwaZulu-Natal'),
('Limpopo'),('Mpumalanga'),('Northern Cape'),('North West'),('Western Cape');

INSERT INTO categories (category_name) VALUES
('IT'),('Sales'),('Admin'),('Construction'),('Finance'),
('Healthcare'),('Education'),('Logistics'),('Hospitality'),('Marketing');

/* ================================================================
   SUGGESTED SERVER-SIDE FILE STORAGE LAYOUT
   ================================================================
   The "documents" table only stores metadata + file_path. Actual
   files should be saved on the Node.js server's disk (or later
   swapped for S3/Blob storage without changing the schema).

   Use stored_file_name (the UUID) as the actual on-disk file name,
   not original_file_name, e.g.:

   /uploads
     /clients
       /{client_id}
         {stored_file_name}.{file_extension}
     /applications
       /{application_id}
         {stored_file_name}.{file_extension}

   documents.file_path would store the relative path, e.g.
   "clients/14/6b1f2c2e-9a3d-4e51-8b2a-1a2b3c4d5e6f.pdf" - since
   stored_file_name is a UUID, no two uploads can ever collide or
   overwrite each other, even if every applicant uploads a file
   called "CV.pdf". The API layer sets the download response's
   Content-Disposition filename to original_file_name so the user
   still sees their own file name.
   ================================================================ */
