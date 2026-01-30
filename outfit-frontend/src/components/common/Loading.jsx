import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ text = 'Loading...', size = 'default', fullScreen = false }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <Loader2 className={`${sizeClasses[size]} text-primary-600 animate-spin`} />
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
};

// Skeleton loaders
export const ProductCardSkeleton = () => (
  <div className="card p-4 animate-pulse">
    <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gray-200 rounded w-16" />
      <div className="h-6 bg-gray-200 rounded w-20" />
    </div>
  </div>
);

export const OutfitCardSkeleton = () => (
  <div className="card p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="h-6 bg-gray-200 rounded w-24" />
      <div className="h-8 bg-gray-200 rounded-full w-16" />
    </div>
    <div className="grid grid-cols-2 gap-4 mb-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
      ))}
    </div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
    <div className="h-4 bg-gray-200 rounded w-2/3" />
  </div>
);

export default Loading;