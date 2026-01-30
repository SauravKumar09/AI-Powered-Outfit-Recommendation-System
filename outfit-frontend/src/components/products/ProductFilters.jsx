import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { CATEGORIES, STYLES, PRICE_RANGES } from '../../utils/constants';
import { capitalize } from '../../utils/helpers';

const ProductFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  filterOptions = null 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ search: searchTerm });
  };

  const handleFilterSelect = (key, value) => {
    onFilterChange({ 
      [key]: filters[key] === value ? null : value 
    });
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="input pl-10 pr-4"
        />
      </form>

      {/* Filter Toggle */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-primary-100 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-500 hover:text-red-600 flex items-center"
          >
            <X className="w-4 h-4 mr-1" />
            Clear all
          </button>
        )}
      </div>

      {/* Expandable Filters */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t animate-fade-in">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => handleFilterSelect('category', value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filters.category === value
                      ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-1">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Style Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Style
            </label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleFilterSelect('style', value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filters.style === value
                      ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map(({ value, label, range }) => (
                <button
                  key={value}
                  onClick={() => handleFilterSelect('price_range', value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filters.price_range === value
                      ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                  <span className="text-xs ml-1 opacity-70">({range})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter - Dynamic from API */}
          {filterOptions?.colors && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {filterOptions.colors.slice(0, 10).map((color) => (
                  <button
                    key={color}
                    onClick={() => handleFilterSelect('color', color)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      filters.color === color
                        ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {capitalize(color)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFilters;