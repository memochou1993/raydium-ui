import { useEffect } from 'react'

import useToken from '@/application/token/useToken'
import { RAYMint } from '@/application/token/utils/wellknownToken.config'

import { useZap } from './useZap'
import toPubString from '@/functions/format/toMintString'
import { QuantumSOLVersionSOL } from '../token/utils/quantumSOL'

export default function useZapInitCoinFiller() {
  const getToken = useToken((s) => s.getToken)
  useEffect(() => {
    const { coin1, coin2 } = useZap.getState()
    if (!coin1 && toPubString(coin2?.mint) !== toPubString(QuantumSOLVersionSOL.mint)) {
      useZap.setState({ coin1: QuantumSOLVersionSOL })
    }
    if (!coin2 && toPubString(coin1?.mint) !== toPubString(RAYMint)) {
      useZap.setState({ coin2: getToken(RAYMint) })
    }
  }, [getToken])
}
