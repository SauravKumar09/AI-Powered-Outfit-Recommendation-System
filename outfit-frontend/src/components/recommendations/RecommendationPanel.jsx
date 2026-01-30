import React from 'react';
import OutfitCard from './OutfitCard';
import ScoreDisplay from './ScoreDisplay';
import { formatPrice, capitalize, getPlaceholderImage } from '../../utils/helpers';

const ItemTile = ({ title, product }) => {
  if (!product) return null;
  const imageUrl = product.image_url || getPlaceholderImage(product.category, product.color);
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <img
        src={imageUrl}
        alt={product.name}
        className="w-14 h-14 rounded object-cover border border-gray-200"
        onError={(e) => {
          e.target.src = getPlaceholderImage(product.category, product.color);
        }}
      />
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
        <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
        <p className="text-xs text-gray-500">{capitalize(product.style)} · {formatPrice(product.price || 0)}</p>
      </div>
    </div>
  );
};

const RecommendationPanel = ({ recommendations, metadata, loading, error, onBack, onRetry, gender = 'male' }) => {
  const hasData = Array.isArray(recommendations) && recommendations.length > 0;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse text-gray-600">Loading recommendations...</div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-red-600 font-medium mb-3">{error}</p>
        <button className="btn btn-secondary" onClick={onRetry}>Try again</button>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-700 font-medium mb-2">No recommendations yet.</p>
        <p className="text-sm text-gray-500 mb-4">Pick a product and adjust preferences to see outfits.</p>
        <button className="btn btn-secondary" onClick={onBack}>Back to products</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">Base product</p>
          <h2 className="text-2xl font-bold text-gray-900">{metadata?.baseProduct?.name}</h2>
          <p className="text-sm text-gray-600">{capitalize(metadata?.baseProduct?.category)} · {formatPrice(metadata?.baseProduct?.price || 0)}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={onBack}>Change product</button>
          <button className="btn btn-primary" onClick={onRetry}>Refresh</button>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((outfit, idx) => (
          <OutfitCard
            key={idx}
            index={idx}
            baseProduct={metadata?.baseProduct}
            outfit={outfit}
            gender={gender}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendationPanel;