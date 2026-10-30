import './Table.css';

export default function Table({ columns, data, onRowClick, loading, emptyMessage = 'No data available' }) {
  if (loading) {
    return (
      <div className="table-wrapper">
        <div className="table-skeleton">
          <div className="table-row">
            <div className="table-cell skeleton" style={{ width: '20%' }} />
            <div className="table-cell skeleton" style={{ width: '15%' }} />
            <div className="table-cell skeleton" style={{ width: '25%' }} />
            <div className="table-cell skeleton" style={{ width: '20%' }} />
            <div className="table-cell skeleton" style={{ width: '20%' }} />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="table-row">
              <div className="table-cell skeleton" style={{ width: '20%' }} />
              <div className="table-cell skeleton" style={{ width: '15%' }} />
              <div className="table-cell skeleton" style={{ width: '25%' }} />
              <div className="table-cell skeleton" style={{ width: '20%' }} />
              <div className="table-cell skeleton" style={{ width: '20%' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-wrapper">
        <div className="table-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <div className="table">
        <div className="table-header">
          {columns.map((col) => (
            <div key={col.key} className={`table-cell table-header-cell ${col.sortable ? 'sortable' : ''}`}>
              {col.header}
              {col.sortable && <span className="sort-indicator">{col.sortDir === 'asc' ? '▲' : '▼'}</span>}
            </div>
          ))}
        </div>
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`table-row ${onRowClick ? 'table-row--clickable' : ''}`}
            onClick={() => onRowClick && onRowClick(row)}
          >
            {columns.map((col) => (
              <div key={col.key} className="table-cell">
                {col.render ? col.render(row) : row[col.key] !== undefined ? row[col.key] : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
