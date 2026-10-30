import './Dialog.css';

export default function Dialog({ open, onClose, title, children, footer, size = 'normal' }) {
  if (!open) return null;

  const sizeClasses = {
    small: 'dialog--small',
    normal: '',
    large: 'dialog--large',
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className={`dialog ${sizeClasses[size]}`} onClick={(e) => e.stopPropagation()}>
        {(title || footer) && (
          <div className="dialog-header">
            <h3>{title}</h3>
            <button className="dialog-close" onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
        <div className="dialog-body">{children}</div>
        {footer && <div className="dialog-footer">{footer}</div>}
      </div>
    </div>
  );
}
