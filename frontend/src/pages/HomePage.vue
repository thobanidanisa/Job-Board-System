<script setup>
import TiltCard from '@/components/common/TiltCard.vue'

const badgeVariants = ['primary', 'secondary', 'accent']

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
].map((feature, i) => ({ ...feature, badge: badgeVariants[i % badgeVariants.length] }))

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
    <section class="tw:relative tw:overflow-hidden" style="padding: 112px 0 140px;">
      <div class="jb-blob-field">
        <div class="jb-blob" style="width: 460px; height: 460px; top: -140px; left: -120px; background: #4F46E5; opacity: 0.65;" />
        <div class="jb-blob" style="width: 420px; height: 420px; bottom: -160px; right: -100px; background: #0EA5A4; opacity: 0.55; animation-delay: -6s;" />
        <div class="jb-blob" style="width: 300px; height: 300px; top: 38%; right: 8%; background: #F59E0B; opacity: 0.32; animation-delay: -3s;" />
      </div>

      <v-container style="max-width: 1200px; position: relative; z-index: 1;">
        <v-row align="center">
          <v-col cols="12" md="6">
            <v-chip color="primary" variant="tonal" class="tw:mb-5" prepend-icon="mdi-sparkles-outline">
              Clients &amp; Employers, one platform
            </v-chip>
            <h1 class="tw:text-4xl tw:md:text-5xl tw:font-extrabold tw:leading-tight" style="color:#1E1B4B">
              Find the right job.<br />Hire the right person.
            </h1>
            <p class="tw:text-lg tw:mt-6" style="color: rgba(30,27,75,0.7); max-width: 480px; line-height: 1.7;">
              JobBoard connects job seekers with verified employers &mdash; smart matching, simple
              applications, and clear tracking from application to interview.
            </p>
            <div class="tw:flex tw:flex-wrap tw:gap-4 tw:mt-10">
              <v-btn
                to="/register?role=client"
                color="primary"
                size="x-large"
                variant="flat"
                class="jb-btn-gradient"
                prepend-icon="mdi-account-search-outline"
              >
                Find a Job
              </v-btn>
              <v-btn to="/register?role=employer" size="x-large" variant="outlined" color="primary" prepend-icon="mdi-briefcase-plus-outline">
                Post a Job
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" md="6" class="tw:mt-12 tw:md:mt-0">
            <TiltCard :max-tilt="5" :base-tilt-x="4" :base-tilt-y="-6">
              <v-card class="jb-glass" elevation="0" rounded="lg">
                <v-card-item class="tw:pa-5">
                  <div class="tw:flex tw:items-center tw:justify-between">
                    <span class="tw:font-semibold" style="color:#1E1B4B">Recommended for you</span>
                    <v-chip size="small" color="success" variant="tonal">92% match</v-chip>
                  </div>
                </v-card-item>
                <v-divider />
                <v-list class="tw:py-3 tw:px-2" bg-color="transparent">
                  <v-list-item
                    v-for="(job, i) in [
                      { title: 'Software Engineer', sub: 'IT · Gauteng', icon: 'mdi-laptop', badge: 'primary' },
                      { title: 'Sales Consultant', sub: 'Sales · Western Cape', icon: 'mdi-account-tie-outline', badge: 'secondary' },
                      { title: 'Site Supervisor', sub: 'Construction · KwaZulu-Natal', icon: 'mdi-hard-hat', badge: 'accent' },
                    ]"
                    :key="job.title"
                    :title="job.title"
                    :subtitle="job.sub"
                    class="tw:mb-1"
                  >
                    <template #prepend>
                      <div
                        class="jb-badge tw:mr-4"
                        :class="`jb-badge--${job.badge}`"
                        style="width: 42px; height: 42px;"
                      >
                        <v-icon :icon="job.icon" size="20" />
                      </div>
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
    <section class="tw:py-24" style="background: rgb(var(--v-theme-surface))">
      <v-container style="max-width: 1200px">
        <div class="tw:text-center tw:mb-14 tw:max-w-2xl tw:mx-auto">
          <h2 class="tw:text-3xl tw:font-bold" style="color:#1E1B4B">Everything you need, in one place</h2>
          <p class="tw:mt-3 tw:text-base" style="color: rgba(30,27,75,0.65)">
            Built for job seekers who want clarity, and employers who want good candidates fast.
          </p>
        </div>

        <v-row>
          <v-col v-for="feature in features" :key="feature.title" cols="12" sm="6" md="4" class="tw:mb-2">
            <TiltCard :glow="feature.badge === 'accent' ? 'primary' : feature.badge">
              <v-card class="tw:h-full" elevation="0">
                <v-card-item class="tw:pa-6">
                  <div class="jb-badge tw:mb-5" :class="`jb-badge--${feature.badge}`" style="width: 56px; height: 56px;">
                    <v-icon :icon="feature.icon" size="28" />
                  </div>
                  <v-card-title class="tw:whitespace-normal tw:px-0 tw:text-lg tw:font-semibold" style="color:#1E1B4B">
                    {{ feature.title }}
                  </v-card-title>
                  <v-card-text class="tw:px-0 tw:pt-2" style="color: rgba(30,27,75,0.65); line-height: 1.6;">
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
    <section class="tw:py-24">
      <v-container style="max-width: 1200px">
        <div class="tw:text-center tw:mb-14">
          <h2 class="tw:text-3xl tw:font-bold" style="color:#1E1B4B">How it works</h2>
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <div class="jb-card tw:p-8 tw:h-full">
              <div class="tw:flex tw:items-center tw:gap-3 tw:mb-6">
                <div class="jb-badge jb-badge--primary" style="width: 40px; height: 40px;">
                  <v-icon icon="mdi-account-search-outline" size="20" />
                </div>
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
                  <div class="tw:text-sm tw:mt-1" style="color: rgba(30,27,75,0.65)">{{ step.text }}</div>
                </v-timeline-item>
              </v-timeline>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="jb-card tw:p-8 tw:h-full">
              <div class="tw:flex tw:items-center tw:gap-3 tw:mb-6">
                <div class="jb-badge jb-badge--secondary" style="width: 40px; height: 40px;">
                  <v-icon icon="mdi-domain" size="20" />
                </div>
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
                  <div class="tw:text-sm tw:mt-1" style="color: rgba(30,27,75,0.65)">{{ step.text }}</div>
                </v-timeline-item>
              </v-timeline>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ================= FINAL CTA ================= -->
    <section class="tw:relative tw:overflow-hidden tw:py-24" style="background: linear-gradient(135deg, #4F46E5, #0EA5A4);">
      <div class="jb-blob-field" style="opacity: 0.5;">
        <div class="jb-blob" style="width: 360px; height: 360px; top: -120px; left: 10%; background: #ffffff; opacity: 0.12;" />
        <div class="jb-blob" style="width: 320px; height: 320px; bottom: -140px; right: 8%; background: #ffffff; opacity: 0.1; animation-delay: -4s;" />
      </div>
      <v-container style="max-width: 900px; position: relative; z-index: 1;">
        <div class="tw:text-center">
          <h2 class="tw:text-3xl tw:font-bold tw:text-white">Ready to get started?</h2>
          <p class="tw:mt-3 tw:text-white tw:text-base" style="opacity: 0.9">
            Create your free account in a couple of minutes.
          </p>
          <div class="tw:flex tw:flex-wrap tw:gap-4 tw:justify-center tw:mt-10">
            <v-btn to="/register?role=client" size="x-large" color="white" variant="flat" style="box-shadow: 0 20px 40px -12px rgba(0,0,0,0.35);">
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
