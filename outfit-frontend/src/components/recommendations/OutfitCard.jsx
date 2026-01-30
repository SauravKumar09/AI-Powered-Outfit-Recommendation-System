import React from 'react';
import { formatPrice, capitalize, getPlaceholderImage } from '../../utils/helpers';
import ScoreDisplay from './ScoreDisplay';

const ProductTile = ({ product }) => {
  if (!product) return null;
  const imageUrl = product.image_url || getPlaceholderImage(product.category, product.color);
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 flex flex-col gap-2">
      <div className="aspect-square bg-gray-50 rounded overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.src = getPlaceholderImage(product.category, product.color);
          }}
        />
      </div>
      <div className="min-h-[48px]">
        <p className="text-sm font-semibold text-gray-900 line-clamp-2">{product.name}</p>
      </div>
      <p className="text-xs text-gray-500">{capitalize(product.category)} · {capitalize(product.style)}</p>
      <p className="text-sm font-bold text-gray-800">{formatPrice(product.price || 0)}</p>
    </div>
  );
};

const OutfitCard = ({ baseProduct, outfit, index, gender = 'male' }) => {
  const mannequin = gender === 'female' ? '/female.jpg' : '/male.jpg';
  const garment = baseProduct?.image_url || getPlaceholderImage(baseProduct?.category, baseProduct?.color);
  const tiles = [outfit.top, outfit.bottom, outfit.footwear, ...(outfit.accessories || [])].filter(Boolean);
  const score = outfit.score ?? 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 bg-gray-50 border border-gray-100 rounded-2xl p-4">
      <div className="lg:col-span-2 bg-white rounded-xl flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg aspect-[3/4] flex items-center justify-center">
          <img
            src={mannequin}
            alt={baseProduct?.name || 'Model'}
            className="w-full h-full object-contain"
          />
          <img
            src={garment}
            alt={baseProduct?.name || 'Outfit piece'}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 object-contain drop-shadow-lg"
            onError={(e) => {
              e.target.src = getPlaceholderImage(baseProduct?.category, baseProduct?.color);
            }}
          />
        </div>
      </div>

      <div className="lg:col-span-3 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Look {index + 1}</p>
            <h3 className="text-lg font-semibold text-gray-900">{baseProduct?.name}</h3>
            <p className="text-sm text-gray-600">{capitalize(baseProduct?.category)} · {formatPrice(baseProduct?.price || 0)}</p>
          </div>
          <div className="w-40">
            <ScoreDisplay score={score} breakdown={outfit.score_breakdown} explanation={outfit.explanation} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {tiles.map((item) => (
            <ProductTile key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OutfitCard;