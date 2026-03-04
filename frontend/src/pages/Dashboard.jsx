import React, { useEffect, useState } from 'react';
import { getDashboard } from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

function StatCard({ title, value, color, icon }) {
  return (
    <div style={{
      background: 'white', borderRadius: '14px', padding: '22px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: `5px solid ${color}`,
      display: 'flex', flexDirection: 'column', gap: '6px'
    }}>
      <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>{icon} {title}</p>
      <h2 style={{ color, margin: 0, fontSize: '26px', fontWeight: 'bold' }}>{value}</h2>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard().then(res => { setData(res.data); setLoading(false); });
  }, []);

  if (loading) return <p style={{ color: '#888' }}>Loading dashboard...</p>;

  const fmt = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <div>
      <h1 style={{ marginBottom: '8px', color: '#1e1e2e' }}>Dashboard</h1>
      <p style={{ color: '#888', marginBottom: '28px', marginTop: 0 }}>Your financial overview this month</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '32px' }}>
        <StatCard title="Net Worth" value={fmt(data.net_worth)} color="#6366f1" icon="💎" />
        <StatCard title="Monthly Income" value={fmt(data.monthly_income)} color="#22c55e" icon="📥" />
        <StatCard title="Monthly Expenses" value={fmt(data.monthly_expenses)} color="#ef4444" icon="📤" />
        <StatCard title="Cash Flow" value={fmt(data.cash_flow)} color={data.cash_flow >= 0 ? '#22c55e' : '#ef4444'} icon="💸" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h3 style={{ margin: '0 0 18px', color: '#1e1e2e' }}>📊 Budget vs Actual Spending</h3>
          {data.budget_comparison.length === 0
            ? <p style={{ color: '#aaa', textAlign: 'center', padding: '40px 0' }}>No budget data yet. Add categories!</p>
            : <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.budget_comparison}>
                  <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="budget" fill="#6366f1" name="Budget" radius={[4,4,0,0]} />
                  <Bar dataKey="spent" fill="#ef4444" name="Spent" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
          }
        </div>

        <div style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h3 style={{ margin: '0 0 18px', color: '#1e1e2e' }}>🥧 Spending by Category</h3>
          {data.spending_by_category.length === 0
            ? <p style={{ color: '#aaa', textAlign: 'center', padding: '40px 0' }}>No transactions yet this month!</p>
            : <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={data.spending_by_category} dataKey="total" nameKey="category__name"
                    cx="50%" cy="50%" outerRadius={90}
                    label={({ category__name, percent }) => `${category__name} ${(percent * 100).toFixed(0)}%`}>
                    {data.spending_by_category.map((entry, i) => (
                      <Cell key={i} fill={entry.category__color || '#6366f1'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
          }
        </div>
      </div>
    </div>
  );
}