'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

// Dark-Mode: Schwarz/Gold wie die Kämpfer-Detailseite
const CHART_COLORS = {
  background: '#1A1A1A',
  grid: 'rgb(55 65 81)', // gray-700
  line: '#B8860B', // Dunkelgold (ACCENT)
  text: 'rgb(156 163 175)',
  tooltipBg: '#101010',
  tooltipBorder: 'rgb(31 41 55)',
}

export type FightHistoryChartPoint = {
  dateLabel: string
  score: number
  result?: 'win' | 'loss' | 'draw' | 'no_contest'
  opponent?: string
}

type Props = {
  data: FightHistoryChartPoint[]
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; payload: FightHistoryChartPoint }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  const resultLabel =
    p.result === 'win'
      ? 'Sieg'
      : p.result === 'loss'
        ? 'Niederlage'
        : p.result === 'draw'
          ? 'Unentschieden'
          : 'No Contest'
  return (
    <div
      className="rounded-lg border px-3 py-2 text-sm shadow-lg"
      style={{
        background: CHART_COLORS.tooltipBg,
        borderColor: CHART_COLORS.tooltipBorder,
        color: CHART_COLORS.text,
      }}
    >
      <p className="font-semibold" style={{ color: '#F3F4F6' }}>
        {label}
      </p>
      {p.opponent && (
        <p className="mt-0.5 text-xs">
          vs. {p.opponent} · {resultLabel}
        </p>
      )}
      <p className="mt-0.5 text-xs font-medium" style={{ color: CHART_COLORS.line }}>
        Punkte: {p.score}
      </p>
    </div>
  )
}

export function FightHistoryChart({ data }: Props) {
  if (!data.length) return null

  return (
    <div className="h-[280px] w-full" style={{ color: CHART_COLORS.text }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_COLORS.grid}
            vertical={false}
          />
          <XAxis
            dataKey="dateLabel"
            stroke={CHART_COLORS.text}
            tick={{ fontSize: 11 }}
            tickLine={{ stroke: CHART_COLORS.grid }}
            axisLine={{ stroke: CHART_COLORS.grid }}
          />
          <YAxis
            stroke={CHART_COLORS.text}
            tick={{ fontSize: 11 }}
            tickLine={{ stroke: CHART_COLORS.grid }}
            axisLine={{ stroke: CHART_COLORS.grid }}
            allowDecimals={false}
            width={28}
          />
          <ReferenceLine
            y={0}
            stroke={CHART_COLORS.grid}
            strokeDasharray="2 2"
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke={CHART_COLORS.line}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS.background, stroke: CHART_COLORS.line, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 5, fill: CHART_COLORS.line, stroke: CHART_COLORS.background, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
