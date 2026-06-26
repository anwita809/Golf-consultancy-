import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { ProblemSection } from '@/components/problem-section'
import { HowItWorks } from '@/components/how-it-works'
import { AssessmentSection } from '@/components/assessment-section'
import { DashboardSection } from '@/components/dashboard-section'
import { RecommendationsSection } from '@/components/recommendations-section'
import { BiodiversitySection } from '@/components/biodiversity-section'
import { ReportPreviewSection } from '@/components/report-preview-section'
import { FinalCta, SiteFooter } from '@/components/final-cta'

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <AssessmentSection />
        <DashboardSection />
        <RecommendationsSection />
        <BiodiversitySection />
        <ReportPreviewSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  )
}
