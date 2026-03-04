import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Accounts from './pages/Accounts';
import Loans from './pages/Loans';

function NavLink({ to, label }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} style={{
      color: active ? '#fff' : '#a5b4fc',
      textDecoration: 'none',
      padding: '10px 14px',
      borderRadius: '8px',
      background: active ? '#6366f1' : 'transparent',
      display: 'block',
      fontWeight: active ? 'bold' : 'normal',
      fontSize: '15px',
    }}>{label}</Link>
  );
}

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
        <nav style={{
          width: '220px', background: '#1e1e2e', color: 'white',
          padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '6px',
          position: 'fixed', height: '100vh', boxSizing: 'border-box'
        }}>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ color: '#6366f1', margin: 0, fontSize: '22px' }}>💰 FinanceIQ</h2>
            <p style={{ color: '#666', fontSize: '12px', margin: '4px 0 0' }}>Personal Finance Manager</p>
          </div>
          <NavLink to="/" label="📊 Dashboard" />
          <NavLink to="/accounts" label="🏦 Accounts" />
          <NavLink to="/transactions" label="💳 Transactions" />
          <NavLink to="/loans" label="📈 Loans" />
        </nav>
        <main style={{ flex: 1, padding: '32px', background: '#f8fafc', marginLeft: '220px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/loans" element={<Loans />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;