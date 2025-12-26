import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`}></div>
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-3">
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
    <Skeleton className="h-8 w-1/2 my-2" />
    <Skeleton className="h-3 w-full" />
  </div>
);