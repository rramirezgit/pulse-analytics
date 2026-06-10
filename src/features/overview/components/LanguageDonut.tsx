'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { LanguageSlice } from '../lib/aggregate'

const PALETTE = ['#8b5cf6', '#22d3ee', '#34d399', '#fbbf24', '#f472b6', '#94a3b8']

export function LanguageDonut({ data }: { data: LanguageSlice[] }) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="name"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            stroke="none"
          >
            {data.map((slice, index) => (
              <Cell key={slice.name} fill={PALETTE[index % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#18181b',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: '#fafafa',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
