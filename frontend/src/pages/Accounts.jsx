import React, { useEffect, useState } from 'react';
import { getAccounts, createAccount, deleteAccount } from '../api';

const COLORS = { checking: '#6366f1', savings: '#22c55e', credit_card: '#ef4444', loan: '#f59e0b' };
const ICONS = { checking: '🏦', savings: '💰', credit_card: '💳', loan: '📋' };

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ name: '', account_type: 'checking', balance: '' });
  const [loading, setLoading] = useState(false);

  const load = () => getAccounts().then(res => setAccounts(res.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!form.name || form.balance === '') return alert('Please fill in all fields');
    setLoading(true);
    await createAccount(form);
    setForm({ name: '', account_type: 'checking', balance: '' });
    await load();
    setLoading(false);
  };

  const inputStyle = {
    padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
    fontSize: '14px', width: '100%', boxSizing: 'border-box', outline: 'none'
  };

  const totalBalance = accounts.reduce((sum, a) => sum + parseFloat(a.balance), 0);

  return (
    <div>
      <h1 style={{ marginBottom: '8px', color: '#1e1e2e' }}>Accounts</h1>
      <p style={{ color: '#888', marginBottom: '28px', marginTop: 0 }}>Total Balance: <strong style={{ color: '#6366f1' }}>${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></p>

      <div style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: '28px' }}>
        <h3 style={{ margin: '0 0 16px' }}>Add New Account</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Account Name</label>
            <input style={inputStyle} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Chase Checking" />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Type</label>
            <select style={inputStyle} value={form.account_type} onChange={e => setForm({...form, account_type: e.target.value})}>
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
              <option value="credit_card">Credit Card</option>
              <option value="loan">Loan</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Balance ($)</label>
            <input style={inputStyle} type="number" value={form.balance} onChange={e => setForm({...form, balance: e.target.value})} placeholder="0.00" />
          </div>
          <button onClick={handleSubmit} disabled={loading} style={{
            padding: '9px 22px', background: '#6366f1', color: 'white',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px'
          }}>{loading ? '...' : '+ Add'}</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
        {accounts.map(acc => (
          <div key={acc.id} style={{
            background: 'white', borderRadius: '14px', padding: '22px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            borderTop: `5px solid ${COLORS[acc.account_type] || '#6366f1'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ margin: 0, fontSize: '18px' }}>{ICONS[acc.account_type]} {acc.name}</p>
                <p style={{ margin: '4px 0 12px', color: '#888', fontSize: '13px', textTransform: 'capitalize' }}>
                  {acc.account_type.replace('_', ' ')}
                </p>
              </div>
              <button onClick={() => deleteAccount(acc.id).then(load)} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: '20px', lineHeight: 1
              }}>×</button>
            </div>
            <p style={{ fontSize: '26px', fontWeight: 'bold', margin: 0,
              color: parseFloat(acc.balance) >= 0 ? '#22c55e' : '#ef4444' }}>
              ${Number(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        ))}
        {accounts.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#aaa' }}>
            No accounts yet. Add your first account above!
          </div>
        )}
      </div>
    </div>
  );
}