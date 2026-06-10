'use client'

import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts'

interface ActivitySparklineProps {
  data: { week: string; commits: number }[]
}

export function ActivitySparkline({ data }: ActivitySparklineProps) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id="commits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="week"
            tick={{ fill: '#71717a', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval={12}
          />
          <Tooltip
            contentStyle={{
              background: '#18181b',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: '#fafafa',
            }}
          />
          <Area
            type="monotone"
            dataKey="commits"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#commits)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
