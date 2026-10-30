import './GlassCard.css';

export default function GlassCard({ children, className = '', padding = '20px', hover = true }) {
  return (
    <div className={`glass-card ${className}`} style={{ padding }}>
      {children}
    </div>
  );
}

export { GlassCard };
