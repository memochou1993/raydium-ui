import { useEffect } from 'react'

import useLiquidity from '../liquidity/useLiquidity'
import { freshKLineChartPrices } from './klinePrice'
import { useZap } from './useZap'

export function useKlineDataFetcher() {
  const coin1 = useZap((s) => s.coin1)
  const coin2 = useZap((s) => s.coin2)
  const jsonInfos = useLiquidity((s) => s.jsonInfos)
  const refreshCount = useZap((s) => s.refreshCount)

  useEffect(() => {
    freshKLineChartPrices()
  }, [coin1, coin2, jsonInfos, refreshCount])
}
