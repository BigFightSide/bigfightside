'use client'

import nextDynamic from 'next/dynamic'
import type { FightHistoryChartPoint } from './FightHistoryChart'

const FightHistoryChart = nextDynamic(
  () =>
    import('./FightHistoryChart').then((mod) => ({
      default: mod.FightHistoryChart,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[280px] w-full animate-pulse rounded-lg bg-anthracite-card"
        aria-hidden
      />
    ),
  },
)

export function FightHistoryChartDynamic({ data }: { data: FightHistoryChartPoint[] }) {
  return <FightHistoryChart data={data} />
}
