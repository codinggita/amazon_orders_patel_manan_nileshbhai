import React from 'react';

export const SkeletonBox = ({ className = '' }) => (
  <div className={`bg-slate-200 dark:bg-white/5 rounded-xl animate-pulse ${className}`} />
);

export const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className={`h-4 bg-slate-200 dark:bg-white/5 rounded animate-pulse ${i === lines - 1 && lines > 1 ? 'w-2/3' : 'w-full'}`} />
    ))}
  </div>
);

export const SkeletonCard = () => (
  <div className="card-panel p-5 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div>
        <div className="h-3 w-24 bg-slate-200 dark:bg-white/5 rounded mb-2" />
        <div className="h-7 w-32 bg-slate-200 dark:bg-white/5 rounded" />
      </div>
      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/5" />
    </div>
    <div className="h-3 w-40 bg-slate-200 dark:bg-white/5 rounded" />
  </div>
);
