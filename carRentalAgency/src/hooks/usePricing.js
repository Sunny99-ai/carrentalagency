import { useEffect, useState } from 'react'
import fallbackPricing from '../data/pricing.json'
import { getPricing } from '../services/pricingApi'

function usePricing() {
  const [pricing, setPricing] = useState(fallbackPricing)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    getPricing()
      .then((data) => {
        if (!isMounted) return
        if (data?.selfDrive && data?.outstation) {
          setPricing(data)
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { pricing, isLoading }
}

export default usePricing
