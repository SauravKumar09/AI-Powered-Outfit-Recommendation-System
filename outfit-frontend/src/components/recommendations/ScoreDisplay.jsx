import React from 'react';
import { TrendingUp, Palette, Shirt, MapPin, Calendar, DollarSign } from 'lucide-react';
import { getScoreRating } from '../../utils/helpers';
import { SCORE_LABELS } from '../../utils/constants';

const ScoreDisplay = ({ score, breakdown, explanation }) => {
  const safeScore = Number.isFinite(score) ? score : 0;
  const rating = getScoreRating(safeScore);
  
  const getScoreColor = (value) => {
    if (value >= 0.8) return 'bg-green-500';
    if (value >= 0.6) return 'bg-blue-500';
    if (value >= 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreIcon = (key) => {
    const icons = {
      color_harmony: Palette,
      style_match: Shirt,
      occasion_fit: MapPin,
      season_match: Calendar,
      budget_alignment: DollarSign,
    };
    return icons[key] || TrendingUp;
  };

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-500">Match Score</span>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-gray-900">
              {Math.round(safeScore * 100)}%
            </span>
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${rating.class}`}>
              {rating.label}
            </span>
          </div>
        </div>
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              strokeWidth="8"
              fill="none"
              className="stroke-gray-200"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              strokeWidth="8"
              fill="none"
              className={`${getScoreColor(safeScore).replace('bg-', 'stroke-')} transition-all duration-1000`}
              strokeDasharray={`${safeScore * 176} 176`}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Score Breakdown */}
      {breakdown && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Score Breakdown</h4>
          {Object.entries(breakdown).map(([key, value]) => {
            const Icon = getScoreIcon(key);
            return (
              <div key={key} className="flex items-center space-x-3">
                <Icon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 flex-1">
                  {SCORE_LABELS[key] || key}
                </span>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getScoreColor(value)} transition-all duration-500`}
                    style={{ width: `${Math.min(Math.max(value, 0), 1) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 w-12 text-right">
                  {Math.round(value * 100)}%
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Explanation */}
      {explanation?.details?.length > 0 && (
        <div className="pt-3 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Why this works</h4>
          <ul className="space-y-1">
            {explanation.details.map((detail, index) => (
              <li key={index} className="flex items-start text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                {detail}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScoreDisplay;