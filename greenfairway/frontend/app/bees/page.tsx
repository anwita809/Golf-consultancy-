import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { BeesPageContent } from '@/components/bees-content'
import { SiteFooter } from '@/components/final-cta'

export const metadata: Metadata = {
  title: 'Bees on Course | GreenFairway',
  description:
    "How golf courses can protect bees without changing the game for players — and what your own course's data says about it.",
}

export default function BeesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <BeesPageContent />
      <SiteFooter />
    </div>
  )
}