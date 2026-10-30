import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/common/GlassCard';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="page-content" style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <GlassCard style={{ maxWidth: '400px', width: '100%', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ margin: '0 0 8px' }}>Create Account</h1>
          <p style={{ margin: '0', opacity: 0.7 }}>Join the simulated crypto platform</p>
        </div>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', fontWeight: 500 }}>
            Full Name
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ marginTop: '4px', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg-card)' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', fontWeight: 500 }}>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginTop: '4px', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg-card)' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', fontWeight: 500 }}>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginTop: '4px', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg-card)' }} />
          </label>
          <button type="submit" className="btn btn--primary" style={{ width: '100%', padding: '12px' }}>Create Account</button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '14px', textAlign: 'center' }}>
          Already have an account? <a href="/login" style={{ color: 'var(--accent)', cursor: 'pointer' }}>Sign in</a>
        </p>
      </GlassCard>
    </div>
  );
}
