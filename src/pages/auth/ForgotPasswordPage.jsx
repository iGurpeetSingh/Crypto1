import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/common/GlassCard';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="page-content" style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <GlassCard style={{ maxWidth: '400px', width: '100%', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ margin: '0 0 8px' }}>Forgot Password</h1>
          <p style={{ margin: '0', opacity: 0.7 }}>Reset your simulated account password</p>
        </div>
        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', fontWeight: 500 }}>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginTop: '4px', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg-card)' }} />
          </label>
          <button type="submit" className="btn btn--primary" style={{ width: '100%', padding: '12px' }}>Send Reset Link</button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '14px', textAlign: 'center' }}>
          Remember your password? <a href="/login" style={{ color: 'var(--accent)', cursor: 'pointer' }}>Sign in</a>
        </p>
      </GlassCard>
    </div>
  );
}
