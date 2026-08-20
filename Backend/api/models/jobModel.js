const pool = require('../db/pool');

const JOB_COLUMNS = `
  job_id, employer_id, job_title, department, description, category_id,
  salary_min, salary_max, province_id, town, application_start_date,
  application_end_date, status, created_at, updated_at
`;

const JOB_COLUMNS_ALIASED = `
  j.job_id, j.employer_id, j.job_title, j.department, j.description, j.category_id,
  j.salary_min, j.salary_max, j.province_id, j.town, j.application_start_date,
  j.application_end_date, j.status, j.created_at, j.updated_at
`;

// The only multi-table write in the app so far: a job plus its optional
// skill tags and required documents must all succeed together, so this
// runs as a real transaction rather than the single pool.query() used
// everywhere else.
async function create({
  employerId,
  jobTitle,
  department,
  description,
  categoryId,
  salaryMin,
  salaryMax,
  provinceId,
  town,
  applicationStartDate,
  applicationEndDate,
  status,
  skillTags,
  requiredDocuments,
}) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO jobs (
         employer_id, job_title, department, description, category_id,
         salary_min, salary_max, province_id, town,
         application_start_date, application_end_date, status
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING ${JOB_COLUMNS}`,
      [
        employerId,
        jobTitle,
        department,
        description,
        categoryId,
        salaryMin ?? null,
        salaryMax ?? null,
        provinceId,
        town,
        applicationStartDate,
        applicationEndDate,
        status,
      ]
    );
    const job = rows[0];

    if (skillTags?.length) {
      const values = [];
      const rowsSql = skillTags.map((tag, i) => {
        values.push(job.job_id, tag);
        return `($${i * 2 + 1}, $${i * 2 + 2})`;
      });
      await client.query(
        `INSERT INTO job_skill_tags (job_id, skill_name) VALUES ${rowsSql.join(',')}`,
        values
      );
    }

    if (requiredDocuments?.length) {
      const values = [];
      const rowsSql = requiredDocuments.map((docType, i) => {
        values.push(job.job_id, docType);
        return `($${i * 2 + 1}, $${i * 2 + 2}, TRUE)`;
      });
      await client.query(
        `INSERT INTO job_required_documents (job_id, document_type, is_mandatory) VALUES ${rowsSql.join(',')}`,
        values
      );
    }

    await client.query('COMMIT');
    return {
      ...job,
      skill_tags: skillTags || [],
      required_documents: requiredDocuments || [],
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function findByEmployer(employerId) {
  const { rows: jobs } = await pool.query(
    `SELECT ${JOB_COLUMNS_ALIASED}, c.category_name
     FROM jobs j
     LEFT JOIN categories c ON c.category_id = j.category_id
     WHERE j.employer_id = $1
     ORDER BY j.created_at DESC`,
    [employerId]
  );

  if (jobs.length === 0) return [];

  const jobIds = jobs.map((j) => j.job_id);

  const [{ rows: tags }, { rows: docs }] = await Promise.all([
    pool.query(
      'SELECT job_id, skill_name FROM job_skill_tags WHERE job_id = ANY($1::bigint[])',
      [jobIds]
    ),
    pool.query(
      'SELECT job_id, document_type FROM job_required_documents WHERE job_id = ANY($1::bigint[])',
      [jobIds]
    ),
  ]);

  const groupByJob = (rows, column) =>
    rows.reduce((acc, row) => {
      (acc[row.job_id] ||= []).push(row[column]);
      return acc;
    }, {});

  const tagsByJob = groupByJob(tags, 'skill_name');
  const docsByJob = groupByJob(docs, 'document_type');

  return jobs.map((j) => ({
    ...j,
    skill_tags: tagsByJob[j.job_id] || [],
    required_documents: docsByJob[j.job_id] || [],
  }));
}

module.exports = { create, findByEmployer };
