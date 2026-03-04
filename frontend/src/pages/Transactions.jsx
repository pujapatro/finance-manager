import React, { useEffect, useState } from 'react';
import { getTransactions, createTransaction, deleteTransaction, getAccounts, getCategories, createCategory } from '../api';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCatForm, setShowCatForm] = useState(false);
  const [catForm, setCatForm] = useState({ name: '', monthly_budget: '', color: '#6366f1' });
  const [form, setForm] = useState({
    description: '', amount: '', transaction_type: 'expense',
    date: new Date().toISOString().split('T')[0],
    account: '', category: '', debit_account: '', credit_account: 'Cash / Bank'
  });

  const load = () => {
    getTransactions().then(res => setTransactions(res.data));
    getAccounts().then(res => setAccounts(res.data));
    getCategories().then(res => setCategories(res.data));
  };
  useEffect(() => { load(); }, []);

  const handleTypeChange = (type) => {
    setForm({...form, transaction_type: type,
      debit_account: type === 'expense' ? 'Expense Account' : 'Cash / Bank',
      credit_account: type === 'expense' ? 'Cash / Bank' : 'Revenue Account'
    });
  };

  const handleSubmit = async () => {
    if (!form.description || !form.amount || !form.account) return alert('Fill in description, amount and account');
    await createTransaction(form);
    setForm({ description: '', amount: '', transaction_type: 'expense',
      date: new Date().toISOString().split('T')[0], account: '', category: '',
      debit_account: 'Expense Account', credit_account: 'Cash / Bank' });
    load();
  };

  const handleAddCategory = async () => {
    if (!catForm.name) return alert('Enter a category name');
    await createCategory(catForm);
    setCatForm({ name: '', monthly_budget: '', color: '#6366f1' });
    setShowCatForm(false);
    load();
  };

  const inputStyle = { padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', width: '100%', boxSizing: 'border-box' };

  return (
    <div>
      <h1 style={{ marginBottom: '8px', color: '#1e1e2e' }}>Transactions</h1>
      <p style={{ color: '#888', marginBottom: '28px', marginTop: 0 }}>{transactions.length} total transactions</p>

      {/* Add Category */}
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => setShowCatForm(!showCatForm)} style={{
          padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0',
          borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: '#6366f1', fontWeight: 'bold'
        }}>+ Add Category</button>
      </div>

      {showCatForm && (
        <div style={{ background: 'white', borderRadius: '14px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 12px' }}>New Category</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px auto', gap: '10px', alignItems: 'end' }}>
            <input style={inputStyle} placeholder="Category name (e.g. Groceries)" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} />
            <input style={inputStyle} type="number" placeholder="Monthly budget" value={catForm.monthly_budget} onChange={e => setCatForm({...catForm, monthly_budget: e.target.value})} />
            <input style={{...inputStyle, padding: '6px'}} type="color" value={catForm.color} onChange={e => setCatForm({...catForm, color: e.target.value})} />
            <button onClick={handleAddCategory} style={{ padding: '9px 18px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
          </div>
        </div>
      )}

      {/* Add Transaction Form */}
      <div style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: '28px' }}>
        <h3 style={{ margin: '0 0 16px' }}>Add Transaction</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
          <input style={inputStyle} placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <input style={inputStyle} type="number" placeholder="Amount ($)" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
          <input style={inputStyle} type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          <select style={inputStyle} value={form.transaction_type} onChange={e => handleTypeChange(e.target.value)}>
            <option value="expense">💸 Expense</option>
            <option value="income">💰 Income</option>
            <option value="transfer">🔄 Transfer</option>
          </select>
          <select style={inputStyle} value={form.account} onChange={e => setForm({...form, account: e.target.value})}>
            <option value="">Select Account</option>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <select style={inputStyle} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            <option value="">Select Category (optional)</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div style={{ background: '#f0f0ff', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
          <p style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 'bold', color: '#6366f1' }}>📒 Double-Entry Bookkeeping</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>DR (Debit Account)</label>
              <input style={inputStyle} value={form.debit_account} onChange={e => setForm({...form, debit_account: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>CR (Credit Account)</label>
              <input style={inputStyle} value={form.credit_account} onChange={e => setForm({...form, credit_account: e.target.value})} />
            </div>
          </div>
        </div>

        <button onClick={handleSubmit} style={{
          padding: '10px 28px', background: '#6366f1', color: 'white',
          border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px'
        }}>+ Add Transaction</button>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Date', 'Description', 'Category', 'Account', 'DR', 'CR', 'Amount', ''].map(h => (
                <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontSize: '12px', color: '#888', borderBottom: '1px solid #f0f0f0', fontWeight: '600' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f8f8f8' }}>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#666' }}>{t.date}</td>
                <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '500' }}>{t.description}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#888' }}>{t.category_name || '—'}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#888' }}>{t.account_name}</td>
                <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6366f1' }}>{t.debit_account}</td>
                <td style={{ padding: '12px 16px', fontSize: '12px', color: '#22c55e' }}>{t.credit_account}</td>
                <td style={{ padding: '12px 16px', fontWeight: 'bold', color: t.transaction_type === 'income' ? '#22c55e' : '#ef4444' }}>
                  {t.transaction_type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => deleteTransaction(t.id).then(load)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ddd', fontSize: '18px' }}>×</button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><td colSpan={8} style={{ padding: '50px', textAlign: 'center', color: '#aaa' }}>No transactions yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}