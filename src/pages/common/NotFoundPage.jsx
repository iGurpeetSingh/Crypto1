import { GlassCard } from '../../components/common/GlassCard';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="page-content" style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <GlassCard style={{ maxWidth: '500px', width: '100%', padding: '48px', textAlign: 'center' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 64, height: 64, margin: '0 auto 24px', opacity: 0.4 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <h1 style={{ margin: '0 0 12px' }}>Page Not Found</h1>
        <p style={{ margin: '0 0 24px', opacity: 0.7 }}>The page you're looking for doesn't exist.</p>
        <button className="btn btn--primary" onClick={() => navigate('/dashboard')} style={{ padding: '12px 24px' }}>Go to Dashboard</button>
      </GlassCard>
    </div>
  );
}
