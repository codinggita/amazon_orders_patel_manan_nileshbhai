import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiSearch, FiSliders } from 'react-icons/fi';

const filters = [
  { id: 'all', label: 'All Fields' },
  { id: 'customer', label: 'Customer Name' },
  { id: 'product', label: 'Product Name' },
  { id: 'orderId', label: 'Order ID' },
  { id: 'date', label: 'Date Range' }
];

const SearchPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fadeIn pb-20">
      <Helmet>
        <title>Advanced Search | OrderPulse</title>
      </Helmet>

      <div className="text-center mb-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-600 mb-3">OrderPulse Intelligence</p>
        <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">Advanced Search</h1>
      </div>

      <div className="w-full max-w-4xl px-4">
        {/* Main Search Bar */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-rose-400 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-rose-500/30 rounded-[2rem] p-2 shadow-2xl">
            <div className="pl-6 pr-4">
              <FiSearch className="text-rose-500" size={28} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all records..."
              className="flex-1 bg-transparent border-none outline-none text-xl md:text-2xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 py-4 h-full w-full"
              autoFocus
            />
            <button className="hidden sm:flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg shadow-rose-600/30 mr-1">
              Search
            </button>
            <button className="sm:hidden flex items-center justify-center bg-rose-600 text-white w-14 h-14 rounded-full mr-1">
              <FiSearch size={24} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                activeFilter === filter.id
                  ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-white dark:bg-[#0a0a0a] border-slate-200 dark:border-rose-500/20 text-slate-600 dark:text-rose-500/80 hover:border-rose-300 dark:hover:border-rose-500/50'
              }`}
            >
              {filter.label}
            </button>
          ))}
          <button className="px-5 py-2.5 rounded-full text-sm font-bold transition-all border bg-white dark:bg-[#0a0a0a] border-slate-200 dark:border-rose-500/20 text-slate-600 dark:text-slate-400 hover:border-slate-300 flex items-center gap-2">
            <FiSliders size={14} />
            More Options
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
