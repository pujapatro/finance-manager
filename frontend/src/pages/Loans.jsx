import React, { useEffect, useState } from 'react';
import { getLoans, createLoan, getAmortization } from '../api';

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [form, setForm] = useState({ name: '', principal: '', annual_interest_rate: '', term_months: '', start_date: new Date().toISOString().split('T')[0] });

  const load = () => getLoans().then(res => setLoans(res.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.principal) return alert('Fill in all fields');
    await createLoan(form);
    setForm({ name: '', principal: '', annual_interest_rate: '', term_months: '', start_date: new Date().toISOString().split('T')[0] });
    load();
  };

  const viewSchedule = async (loan) => {
    const res = await getAmortization(loan.id);
    setSchedule(res.data);
    setSelectedLoan(loan);
  };

  const inputStyle = { padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', width: '100%', boxSizing: 'border-box' };

  return (
    <div>
      <h1 style={{ marginBottom: '8px', color: '#1e1e2e' }}>Loans & Amortization</h1>
      <p style={{ color: '#888', marginBottom: '28px', marginTop: 0 }}>Track loans and see payment breakdowns</p>

      <div style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: '28px' }}>
        <h3 style={{ margin: '0 0 16px' }}>Add Loan</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', alignItems: 'end' }}>
          <div><label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Loan Name</label>
            <input style={inputStyle} placeholder="e.g. Student Loan" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div><label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Principal ($)</label>
            <input style={inputStyle} type="number" placeholder="25000" value={form.principal} onChange={e => setForm({...form, principal: e.target.value})} /></div>
          <div><label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Interest Rate (%)</label>
            <input style={inputStyle} type="number" step="0.1" placeholder="5.5" value={form.annual_interest_rate} onChange={e => setForm({...form, annual_interest_rate: e.target.value})} /></div>
          <div><label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Term (months)</label>
            <input style={inputStyle} type="number" placeholder="120" value={form.term_months} onChange={e => setForm({...form, term_months: e.target.value})} /></div>
          <button onClick={handleSubmit} style={{ padding: '9px 18px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>+ Add</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '32px' }}>
        {loans.map(loan => (
          <div key={loan.id} style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderTop: '5px solid #ef4444' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '17px' }}>📋 {loan.name}</h4>
            <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>Principal: <strong>${Number(loan.principal).toLocaleString()}</strong></p>
            <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>Rate: <strong>{loan.annual_interest_rate}%</strong></p>
            <p style={{ margin: '4px 0 14px', color: '#666', fontSize: '14px' }}>Term: <strong>{loan.term_months} months ({(loan.term_months/12).toFixed(1)} years)</strong></p>
            <button onClick={() => viewSchedule(loan)} style={{
              padding: '8px 18px', background: selectedLoan?.id === loan.id ? '#ef4444' : '#6366f1',
              color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold'
            }}>📊 View Schedule</button>
          </div>
        ))}
        {loans.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#aaa' }}>No loans added yet.</div>}
      </div>

      {schedule && (
        <div style={{ background: 'white', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '22px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
            <h3 style={{ margin: '0 0 8px' }}>📈 {schedule.loan_name} — Amortization Schedule</h3>
            <div style={{ display: 'flex', gap: '32px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Monthly Payment: <strong style={{ color: '#6366f1' }}>${schedule.monthly_payment}</strong></p>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Total Paid: <strong>${schedule.total_paid}</strong></p>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Total Interest: <strong style={{ color: '#ef4444' }}>${schedule.total_interest}</strong></p>
            </div>
          </div>
          <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, background: '#f8fafc' }}>
                <tr>
                  {['Month', 'Payment', 'Principal', 'Interest', 'Remaining Balance'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#888', borderBottom: '1px solid #f0f0f0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule.schedule.map(row => (
                  <tr key={row.month} style={{ borderBottom: '1px solid #f8f8f8' }}>
                    <td style={{ padding: '11px 16px', fontSize: '14px', color: '#888' }}>{row.month}</td>
                    <td style={{ padding: '11px 16px', fontSize: '14px' }}>${row.payment}</td>
                    <td style={{ padding: '11px 16px', fontSize: '14px', color: '#22c55e', fontWeight: '500' }}>${row.principal}</td>
                    <td style={{ padding: '11px 16px', fontSize: '14px', color: '#ef4444', fontWeight: '500' }}>${row.interest}</td>
                    <td style={{ padding: '11px 16px', fontSize: '14px', fontWeight: 'bold' }}>${row.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}