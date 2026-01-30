import React from 'react';
import { Sparkles } from 'lucide-react';
import Badge from '../common/Badge';
import { formatPrice, capitalize, getColorHex, getPlaceholderImage, cn } from '../../utils/helpers';

const ProductCard = ({ product, onSelect, onGetRecommendations, isSelected }) => {
  const imageUrl = product.image_url || getPlaceholderImage(product.category, product.color);
  const colorHex = getColorHex(product.color);

  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden',
        isSelected && 'ring-2 ring-primary-500'
      )}
    >
      <div className="aspect-square bg-gray-50 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = getPlaceholderImage(product.category, product.color);
          }}
        />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
            <p className="text-sm text-gray-500">{capitalize(product.sub_category) || capitalize(product.category)}</p>
          </div>
          <div
            className="w-10 h-10 rounded-full border border-gray-200 shadow-inner"
            style={{ backgroundColor: colorHex }}
            title={capitalize(product.color)}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary-600">{formatPrice(product.price || 0)}</span>
          <Badge variant="primary">{capitalize(product.style)}</Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Badge variant="info" size="small">{capitalize(product.category)}</Badge>
          {product.price_range && (
            <Badge variant="success" size="small">{capitalize(product.price_range)}</Badge>
          )}
        </div>

        <div className="flex gap-2">
          <button
            className="btn btn-secondary w-full"
            onClick={() => onSelect?.(product)}
          >
            View details
          </button>
          <button
            className="btn btn-primary w-full"
            onClick={() => onGetRecommendations?.(product)}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Style it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;