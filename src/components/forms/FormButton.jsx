import './FormButton.css';

export default function FormButton({ children, variant = 'primary', size = 'medium', disabled, loading, onClick, type = 'button', className = '' }) {
  const variants = {
    primary: 'btn--primary',
    secondary: 'btn--secondary',
    ghost: 'btn--ghost',
    danger: 'btn--danger',
    success: 'btn--success',
  };

  const sizes = {
    small: 'btn--small',
    medium: 'btn--medium',
    large: 'btn--large',
  };

  return (
    <button
      type={type}
      className={`btn ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <span className="btn-spinner" />}
      {children}
    </button>
  );
}
