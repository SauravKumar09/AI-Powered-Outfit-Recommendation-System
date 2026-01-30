import React from 'react';
import { X, Sparkles, Tag, Calendar, DollarSign } from 'lucide-react';
import Badge from '../common/Badge';
import { formatPrice, getColorHex, capitalize, getPlaceholderImage } from '../../utils/helpers';

const ProductDetail = ({ product, onClose, onGetRecommendations }) => {
  if (!product) return null;

  const colorHex = getColorHex(product.color);
  const imageUrl = product.image_url || getPlaceholderImage(product.category, product.color);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="md:flex">
            {/* Image */}
            <div className="md:w-1/2">
              <div className="aspect-square bg-gray-100">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = getPlaceholderImage(product.category, product.color);
                  }}
                />
              </div>
            </div>

            {/* Details */}
            <div className="md:w-1/2 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-500">
                    {capitalize(product.sub_category)}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-full border-2 border-gray-200 shadow-inner flex-shrink-0"
                  style={{ backgroundColor: colorHex }}
                  title={capitalize(product.color)}
                />
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-primary-600 mb-6">
                {formatPrice(product.price)}
              </div>

              {/* Attributes */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Category:</span>
                  <Badge variant="primary">{capitalize(product.category)}</Badge>
                </div>

                <div className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Style:</span>
                  <Badge variant="purple">{capitalize(product.style)}</Badge>
                </div>

                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Price Range:</span>
                  <Badge variant="info">{capitalize(product.price_range)}</Badge>
                </div>
              </div>

              {/* Occasions */}
              {product.occasions?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Perfect for:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.occasions.map((occasion) => (
                      <Badge key={occasion} variant="default">
                        {capitalize(occasion)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Seasons */}
              {product.seasons?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Seasons:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.seasons.map((season) => (
                      <Badge key={season} variant="success">
                        {capitalize(season)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {product.tags?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Tags:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="default" size="small">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={() => onGetRecommendations(product)}
            className="btn btn-primary w-full"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Get Outfit Recommendations
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;