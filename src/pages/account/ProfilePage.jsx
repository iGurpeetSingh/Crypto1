import { GlassCard } from '../../components/common/GlassCard';

export default function ProfilePage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Profile</h1><p className="page-subtitle">Edit your simulated profile information</p></GlassCard>
      <GlassCard style={{ maxWidth: '500px', margin: '20px auto 0' }}>
        <div className="card-chart-header"><h3>Profile Information</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="table-wrapper"><div className="table"><div className="table-row"><div className="table-cell table-header-cell">Username</div><div className="table-cell">demo_user</div></div><div className="table-row"><div className="table-cell table-header-cell">Email</div><div className="table-cell">demo@example.com</div></div><div className="table-row"><div className="table-cell table-header-cell">Member Since</div><div className="table-cell">Today (demo)</div></div></div></div>
        </div>
      </GlassCard>
    </div>
  );
}
