import React from 'react';
import { FiChevronLeft, FiChevronRight, FiSearch, FiSliders } from 'react-icons/fi';

const DataTable = ({
  columns,
  data,
  pagination,
  onPageChange,
  onSearch,
  onFilterChange,
  isLoading,
  searchPlaceholder = 'Search...',
}) => {
  // Calculate visible page buttons (max 5)
  const getPageNumbers = () => {
    if (!pagination) return [];
    const total = pagination.totalPages;
    const current = pagination.page;
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, 4, 5];
    if (current >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total];
    return [current - 2, current - 1, current, current + 1, current + 2];
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" size={14} style={{ color: '#475569' }} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full text-sm py-2.5 pl-9 pr-4 rounded-xl outline-none text-white placeholder-slate-600 transition-all"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          />
        </div>
        {onFilterChange && (
          <button
            onClick={onFilterChange}
            className="flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-xl transition-colors"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#94A3B8' }}
          >
            <FiSliders size={13} /> Filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {columns.map((col, i) => (
                  <th key={i} className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap"
                    style={{ color: '#334155' }}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 rounded-full animate-spin"
                        style={{ borderColor: 'rgba(99,102,241,0.2)', borderTopColor: '#6366F1' }} />
                      <span className="text-xs" style={{ color: '#334155' }}>Loading data...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <FiSearch size={16} style={{ color: '#1E293B' }} />
                      </div>
                      <span className="text-xs" style={{ color: '#334155' }}>No data found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row, ri) => (
                  <tr key={ri} className="group transition-colors hover:bg-white/[0.015]"
                    style={{ borderBottom: ri < data.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    {columns.map((col, ci) => (
                      <td key={ci} className="px-5 py-3.5 text-sm text-white whitespace-nowrap">
                        {col.render ? col.render(row) : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalDocs > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
          <span className="text-xs" style={{ color: '#334155' }}>
            Showing{' '}
            <span style={{ color: '#64748B' }}>{(pagination.page - 1) * pagination.limit + 1}</span>
            –
            <span style={{ color: '#64748B' }}>{Math.min(pagination.page * pagination.limit, pagination.totalDocs)}</span>
            {' '}of{' '}
            <span style={{ color: '#64748B' }}>{pagination.totalDocs}</span>
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: '#64748B' }}
            >
              <FiChevronLeft size={14} />
            </button>

            {getPageNumbers().map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all"
                style={pagination.page === p
                  ? { background: '#6366F1', color: '#fff', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }
                  : { color: '#475569' }
                }
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: '#64748B' }}
            >
              <FiChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
