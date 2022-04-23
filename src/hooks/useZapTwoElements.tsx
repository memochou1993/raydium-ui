import { RefObject, useCallback, useEffect, useState } from 'react'

import { inServer } from '@/functions/judgers/isSSR'

export function useZapTwoElements(
  zap1: RefObject<HTMLDivElement | null>,
  zap2: RefObject<HTMLDivElement | null>,
  options?: { defaultHasWrapped?: boolean }
): [hasWrapped: boolean, controller: { toggleZap: () => void; resetZapPosition(): void }] {
  const transitionValue = 'all .4s cubic-bezier(0.4, 0, 0.2, 1)'
  const [hasSwrapped, setHasWrapped] = useState(options?.defaultHasWrapped ?? false)

  function applyDefault() {
    if (inServer) return
    if (!options?.defaultHasWrapped) return
    const dom1 = zap1.current
    const dom2 = zap2.current
    if (!dom1 || !dom2) return
    const dom1Rect = dom1.getBoundingClientRect()
    const dom2Rect = dom2.getBoundingClientRect()
    const distance = dom2Rect.top - dom1Rect.top
    const dom1IsAboveDom2 = dom1Rect.top < dom2Rect.top ? 1 : -1

    dom1.style.setProperty('transition', '')
    dom2.style.setProperty('transition', '')
    dom1.style.setProperty('transform', `translateY(${distance * dom1IsAboveDom2}px)`)
    dom2.style.setProperty('transform', `translateY(${-distance * dom1IsAboveDom2}px)`)
  }
  useEffect(applyDefault, [])

  const toggleZap = useCallback(() => {
    const dom1 = zap1.current
    const dom2 = zap2.current
    if (!dom1 || !dom2) return
    const dom1Rect = dom1.getBoundingClientRect()
    const dom2Rect = dom2.getBoundingClientRect()

    const distance = dom2Rect.top - dom1Rect.top

    const dom1IsAboveDom2 = dom1Rect.top < dom2Rect.top ? 1 : -1
    dom1.style.setProperty('transition', transitionValue)
    dom2.style.setProperty('transition', transitionValue)
    if (hasSwrapped) {
      dom1.style.setProperty('transform', `translateY(0px)`)
      dom2.style.setProperty('transform', `translateY(0px)`)
      setHasWrapped(false)
    } else {
      dom1.style.setProperty('transform', `translateY(${distance * dom1IsAboveDom2}px)`)
      dom2.style.setProperty('transform', `translateY(${-distance * dom1IsAboveDom2}px)`)
      setHasWrapped(true)
    }
  }, [hasSwrapped, zap1, zap2])

  const resetZapPosition = useCallback(() => {
    const dom1 = zap1.current
    const dom2 = zap2.current
    if (!dom1 || !dom2) return
    dom1.style.setProperty('transition', transitionValue)
    dom2.style.setProperty('transition', transitionValue)
    dom1.style.setProperty('transform', `translateY(0px)`)
    dom2.style.setProperty('transform', `translateY(0px)`)
  }, [hasSwrapped, zap1, zap2])

  useEffect(() => {
    const dom1 = zap1.current
    const dom2 = zap2.current
    dom1?.addEventListener('transitionstart', () => {
      dom1?.style.setProperty('pointerEvents', 'none')
    })
    dom1?.addEventListener('transitionend', () => {
      dom1?.style.setProperty('pointerEvents', '')
    })
    dom2?.addEventListener('transitionstart', () => {
      dom2?.style.setProperty('pointerEvents', 'none')
    })
    dom2?.addEventListener('transitionend', () => {
      dom2?.style.setProperty('pointerEvents', '')
    })
  }, [zap1, zap2])

  return [hasSwrapped, { toggleZap, resetZapPosition }]
}
