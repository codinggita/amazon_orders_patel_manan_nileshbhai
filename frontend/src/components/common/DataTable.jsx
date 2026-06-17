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
  hideToolbar = false,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

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
    <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-indigo-500/10 rounded-2xl overflow-hidden flex flex-col transition-colors duration-200 shadow-sm dark:shadow-[0_4px_24px_-8px_rgba(225,29,72,0.1)]">
      {/* Table Header Controls */}
      {!hideToolbar && (
        <div className="p-5 border-b border-slate-200 dark:border-indigo-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-indigo-500/20 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all focus:shadow-[0_0_10px_rgba(225,29,72,0.1)]"
          />
        </div>
        {onFilterChange && (
          <button
            onClick={onFilterChange}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-indigo-500/5 border border-slate-200 dark:border-indigo-500/20 rounded-xl text-sm font-semibold text-slate-600 dark:text-indigo-500/80 hover:bg-slate-100 dark:hover:bg-indigo-500/10 transition-colors"
          >
            <FiSliders size={14} />
            <span className="hidden sm:inline">Filters</span>
          </button>
        )}
      </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-indigo-500/5 border-b border-slate-200 dark:border-indigo-500/10">
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-indigo-500/80 uppercase tracking-[0.1em] whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 border-2 rounded-full animate-spin border-indigo-500/20 border-t-indigo-500" />
                    Loading data...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                  No data found.
                </td>
              </tr>
            ) : (
              data.map((row, ri) => (
                <tr key={ri} className="hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors">
                  {columns.map((col, ci) => (
                    <td key={ci} className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="p-5 border-t border-slate-200 dark:border-indigo-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 dark:bg-transparent">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing <span className="font-medium text-slate-700 dark:text-white">{Math.min((pagination.page - 1) * pagination.limit + 1, pagination.totalDocs)}</span> to{' '}
            <span className="font-medium text-slate-700 dark:text-white">{Math.min(pagination.page * pagination.limit, pagination.totalDocs)}</span> of{' '}
            <span className="font-medium text-slate-700 dark:text-white">{pagination.totalDocs}</span> results
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 text-slate-500 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronLeft size={16} />
            </button>

            {getPageNumbers().map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                  pagination.page === p
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 border border-indigo-500'
                    : 'text-slate-600 dark:text-slate-400 border border-transparent hover:border-slate-200 dark:hover:border-indigo-500/20 hover:bg-slate-100 dark:hover:bg-indigo-500/10'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 text-slate-500 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
