import React from 'react';
import { Settings, Calendar, DollarSign, MapPin, User2 } from 'lucide-react';
import { OCCASIONS, SEASONS, PRICE_RANGES } from '../../utils/constants';

const PreferencesForm = ({ preferences, onPreferenceChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Settings className="w-5 h-5 text-primary-600" />
        <h3 className="font-semibold text-gray-900">Customize Your Style</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Gender */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <User2 className="w-4 h-4 mr-1" />
            Model
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                className={`btn btn-secondary w-full ${preferences.gender === option.value ? 'border-primary-500 text-primary-700 bg-primary-50' : ''}`}
                onClick={() => onPreferenceChange({ gender: option.value })}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Occasion */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            Occasion
          </label>
          <select
            value={preferences.occasion || ''}
            onChange={(e) => onPreferenceChange({ occasion: e.target.value || null })}
            className="select"
          >
            <option value="">Any Occasion</option>
            {OCCASIONS.map(({ value, label, icon }) => (
              <option key={value} value={value}>
                {icon} {label}
              </option>
            ))}
          </select>
        </div>

        {/* Season */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 mr-1" />
            Season
          </label>
          <select
            value={preferences.season || ''}
            onChange={(e) => onPreferenceChange({ season: e.target.value || null })}
            className="select"
          >
            <option value="">Any Season</option>
            {SEASONS.map(({ value, label, icon }) => (
              <option key={value} value={value}>
                {icon} {label}
              </option>
            ))}
          </select>
        </div>

        {/* Budget */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 mr-1" />
            Budget
          </label>
          <select
            value={preferences.budget || ''}
            onChange={(e) => onPreferenceChange({ budget: e.target.value || null })}
            className="select"
          >
            <option value="">Any Budget</option>
            {PRICE_RANGES.map(({ value, label, range }) => (
              <option key={value} value={value}>
                {label} ({range})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PreferencesForm;