'use client'

import { PurchaseSteps } from '@/app/components/PurchaseSteps'
import SelectedSizeBanner from '@/app/components/SelectedSizeBanner'

export function PurchaseInfoSection() {
  return (
    <section className="nv-purchase-info">
      <div className="max-w-xl mx-auto px-4 py-6 sm:py-8">
        <PurchaseSteps />
        <div className="mt-4">
          <SelectedSizeBanner />
        </div>
      </div>
    </section>
  )
}
