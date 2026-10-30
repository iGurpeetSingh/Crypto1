import { GlassCard } from '../../components/common/GlassCard';

export default function NotificationPrefsPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Notification Preferences</h1><p className="page-subtitle">Configure your simulated notification settings</p></GlassCard>
      <GlassCard style={{ maxWidth: '500px', margin: '20px auto 0' }}>
        <div className="card-chart-header"><h3>Notification Options</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="table-wrapper"><div className="table"><div className="table-row"><div className="table-cell table-header-cell">Price Alerts</div><div className="table-cell text-success">Enabled</div></div><div className="table-row"><div className="table-cell table-header-cell">Order Updates</div><div className="table-cell text-success">Enabled</div></div><div className="table-row"><div className="table-cell table-header-cell">Weekly Report</div><div className="table-cell">Disabled</div></div></div></div>
        </div>
      </GlassCard>
    </div>
  );
}
