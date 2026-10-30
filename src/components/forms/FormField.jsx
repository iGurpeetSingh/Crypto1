import './FormField.css';

export default function FormField({ label, error, icon, children, fullWidth = false, hint }) {
  return (
    <div className={`form-field ${fullWidth ? 'form-field--full' : ''}`}>
      {label && (
        <label className="form-label">
          {label}
          {hint && <span className="form-hint">{hint}</span>}
        </label>
      )}
      <div className="form-input-wrapper">
        {icon && <span className="form-icon">{icon}</span>}
        {children}
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
