<script setup>
import TiltCard from '@/components/common/TiltCard.vue'

const features = [
  {
    icon: 'mdi-target-account',
    title: 'Smart Job Matching',
    text: 'Jobs are suggested from your career interests, location and resume, so you see relevant roles first.',
  },
  {
    icon: 'mdi-file-document-multiple-outline',
    title: 'One-Click Applications',
    text: 'Attach your CV, ID and certificates once, then apply to any job in a couple of clicks.',
  },
  {
    icon: 'mdi-progress-check',
    title: 'Real-Time Application Tracking',
    text: 'Follow every application through Pending, Reviewed, Accepted or Declined, with instant updates.',
  },
  {
    icon: 'mdi-shield-check-outline',
    title: 'Verified Employers',
    text: 'Employer accounts go through a verification step, so you know who you are applying to.',
  },
  {
    icon: 'mdi-email-check-outline',
    title: 'Email Notifications',
    text: 'Get emailed the moment your application is submitted, reviewed or a decision is made.',
  },
  {
    icon: 'mdi-calendar-clock-outline',
    title: 'Interview Scheduling',
    text: 'Accepted candidates receive interview date, time and location automatically.',
  },
]

const jobSeekerSteps = [
  { title: 'Create your profile', text: 'Tell us your details and career interests.' },
  { title: 'Search & apply', text: 'Find roles that match and apply with your documents.' },
  { title: 'Track & get hired', text: 'Watch your status update and book your interview.' },
]

const employerSteps = [
  { title: 'Register your company', text: 'Set up your employer account and get verified.' },
  { title: 'Post a job', text: 'Describe the role, department and requirements.' },
  { title: 'Review & decide', text: 'Compare candidates and schedule interviews.' },
]
</script>

<template>
  <div>
    <!-- ================= HERO ================= -->
    <section class="tw:relative tw:overflow-hidden" style="padding: 96px 0 120px;">
      <div class="jb-blob-field">
        <div class="jb-blob" style="width: 420px; height: 420px; top: -120px; left: -100px; background: #4F46E5;" />
        <div class="jb-blob" style="width: 380px; height: 380px; bottom: -140px; right: -80px; background: #0EA5A4; animation-delay: -6s;" />
        <div class="jb-blob" style="width: 260px; height: 260px; top: 40%; right: 12%; background: #F59E0B; opacity: 0.28; animation-delay: -3s;" />
      </div>

      <v-container style="max-width: 1200px; position: relative; z-index: 1;">
        <v-row align="center">
          <v-col cols="12" md="6">
            <v-chip color="primary" variant="tonal" class="tw:mb-4" prepend-icon="mdi-sparkles-outline">
              Clients &amp; Employers, one platform
            </v-chip>
            <h1 class="tw:text-4xl tw:md:text-5xl tw:font-extrabold tw:leading-tight" style="color:#1E1B4B">
              Find the right job.<br />Hire the right person.
            </h1>
            <p class="tw:text-lg tw:mt-5" style="color: rgba(30,27,75,0.7); max-width: 480px;">
              JobBoard connects job seekers with verified employers &mdash; smart matching, simple
              applications, and clear tracking from application to interview.
            </p>
            <div class="tw:flex tw:flex-wrap tw:gap-3 tw:mt-8">
              <v-btn to="/register?role=client" color="primary" size="x-large" variant="flat" elevation="4" prepend-icon="mdi-account-search-outline">
                Find a Job
              </v-btn>
              <v-btn to="/register?role=employer" size="x-large" variant="outlined" color="primary" prepend-icon="mdi-briefcase-plus-outline">
                Post a Job
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <TiltCard :max-tilt="6">
              <v-card class="jb-glass tw:p-1" elevation="0" rounded="lg">
                <v-card-item>
                  <div class="tw:flex tw:items-center tw:justify-between">
                    <span class="tw:font-semibold" style="color:#1E1B4B">Recommended for you</span>
                    <v-chip size="small" color="success" variant="tonal">92% match</v-chip>
                  </div>
                </v-card-item>
                <v-divider />
                <v-list class="tw:py-2" bg-color="transparent">
                  <v-list-item
                    v-for="job in [
                      { title: 'Software Engineer', sub: 'IT · Gauteng', icon: 'mdi-laptop' },
                      { title: 'Sales Consultant', sub: 'Sales · Western Cape', icon: 'mdi-account-tie-outline' },
                      { title: 'Site Supervisor', sub: 'Construction · KwaZulu-Natal', icon: 'mdi-hard-hat' },
                    ]"
                    :key="job.title"
                    :title="job.title"
                    :subtitle="job.sub"
                  >
                    <template #prepend>
                      <v-avatar color="primary" variant="tonal">
                        <v-icon :icon="job.icon" />
                      </v-avatar>
                    </template>
                    <template #append>
                      <v-chip size="small" variant="tonal">Open</v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>
            </TiltCard>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ================= FEATURES ================= -->
    <section class="tw:py-20" style="background: rgb(var(--v-theme-surface))">
      <v-container style="max-width: 1200px">
        <div class="tw:text-center tw:mb-12 tw:max-w-2xl tw:mx-auto">
          <h2 class="tw:text-3xl tw:font-bold" style="color:#1E1B4B">Everything you need, in one place</h2>
          <p class="tw:mt-3" style="color: rgba(30,27,75,0.65)">
            Built for job seekers who want clarity, and employers who want good candidates fast.
          </p>
        </div>

        <v-row>
          <v-col v-for="feature in features" :key="feature.title" cols="12" sm="6" md="4">
            <TiltCard>
              <v-card class="tw:p-2" height="100%" variant="flat" style="border: 1px solid rgba(226,232,240,0.9)">
                <v-card-item>
                  <v-avatar color="primary" variant="tonal" size="48" class="tw:mb-3">
                    <v-icon :icon="feature.icon" size="26" />
                  </v-avatar>
                  <v-card-title class="tw:whitespace-normal tw:text-lg tw:font-semibold" style="color:#1E1B4B">
                    {{ feature.title }}
                  </v-card-title>
                  <v-card-text class="tw:px-0" style="color: rgba(30,27,75,0.65)">
                    {{ feature.text }}
                  </v-card-text>
                </v-card-item>
              </v-card>
            </TiltCard>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ================= HOW IT WORKS ================= -->
    <section class="tw:py-20">
      <v-container style="max-width: 1200px">
        <div class="tw:text-center tw:mb-12">
          <h2 class="tw:text-3xl tw:font-bold" style="color:#1E1B4B">How it works</h2>
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <v-card class="tw:p-4" variant="flat" style="border: 1px solid rgba(226,232,240,0.9)">
              <div class="tw:flex tw:items-center tw:gap-2 tw:mb-4">
                <v-icon icon="mdi-account-search-outline" color="primary" />
                <span class="tw:font-semibold tw:text-lg" style="color:#1E1B4B">For Job Seekers</span>
              </div>
              <v-timeline density="compact" side="end" line-color="primary">
                <v-timeline-item
                  v-for="(step, i) in jobSeekerSteps"
                  :key="step.title"
                  dot-color="primary"
                  size="small"
                >
                  <div class="tw:font-medium" style="color:#1E1B4B">{{ i + 1 }}. {{ step.title }}</div>
                  <div class="tw:text-sm" style="color: rgba(30,27,75,0.65)">{{ step.text }}</div>
                </v-timeline-item>
              </v-timeline>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="tw:p-4" variant="flat" style="border: 1px solid rgba(226,232,240,0.9)">
              <div class="tw:flex tw:items-center tw:gap-2 tw:mb-4">
                <v-icon icon="mdi-domain" color="secondary" />
                <span class="tw:font-semibold tw:text-lg" style="color:#1E1B4B">For Employers</span>
              </div>
              <v-timeline density="compact" side="end" line-color="secondary">
                <v-timeline-item
                  v-for="(step, i) in employerSteps"
                  :key="step.title"
                  dot-color="secondary"
                  size="small"
                >
                  <div class="tw:font-medium" style="color:#1E1B4B">{{ i + 1 }}. {{ step.title }}</div>
                  <div class="tw:text-sm" style="color: rgba(30,27,75,0.65)">{{ step.text }}</div>
                </v-timeline-item>
              </v-timeline>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ================= FINAL CTA ================= -->
    <section class="tw:relative tw:overflow-hidden tw:py-20" style="background: linear-gradient(135deg, #4F46E5, #0EA5A4);">
      <v-container style="max-width: 900px; position: relative; z-index: 1;">
        <div class="tw:text-center">
          <h2 class="tw:text-3xl tw:font-bold tw:text-white">Ready to get started?</h2>
          <p class="tw:mt-3 tw:text-white" style="opacity: 0.9">
            Create your free account in a couple of minutes.
          </p>
          <div class="tw:flex tw:flex-wrap tw:gap-3 tw:justify-center tw:mt-8">
            <v-btn to="/register?role=client" size="x-large" color="white" variant="flat">
              <span style="color:#4F46E5; font-weight:600">Register as Job Seeker</span>
            </v-btn>
            <v-btn to="/register?role=employer" size="x-large" variant="outlined" color="white">
              Register as Employer
            </v-btn>
          </div>
        </div>
      </v-container>
    </section>
  </div>
</template>
