"""
Scoring service for calculating outfit match scores.

SCORING BREAKDOWN:
- Color Harmony: 30%
- Style Match: 25%
- Occasion Fit: 20%
- Season Match: 15%
- Budget Alignment: 10%
"""

from typing import Dict, List, Optional, Any
from .color_service import ColorService
from .constants import (
    STYLE_COMPATIBILITY,
    SEASON_COMPATIBILITY,
    PRICE_RANGES,
    SCORING_WEIGHTS,
)


class ScoringService:
    """
    Service for calculating and explaining outfit scores.
    """
    
    WEIGHTS = SCORING_WEIGHTS
    
    @classmethod
    def calculate_outfit_score(
        cls,
        outfit: Dict[str, Any],
        preferences: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """
        Calculate overall match score for an outfit.
        """
        if preferences is None:
            preferences = {}
        
        # Collect all products in the outfit
        products = []
        if outfit.get('top'):
            products.append(outfit['top'])
        if outfit.get('bottom'):
            products.append(outfit['bottom'])
        if outfit.get('footwear'):
            products.append(outfit['footwear'])
        if outfit.get('accessories'):
            products.extend(outfit['accessories'])
        
        # Calculate individual scores
        scores = {
            'color_harmony': cls._calculate_color_score(products),
            'style_match': cls._calculate_style_score(products),
            'occasion_fit': cls._calculate_occasion_score(products, preferences.get('occasion')),
            'season_match': cls._calculate_season_score(products, preferences.get('season')),
            'budget_alignment': cls._calculate_budget_score(products, preferences.get('budget')),
        }
        
        # Calculate weighted total
        total_score = sum(
            scores[key] * cls.WEIGHTS[key]
            for key in scores
        )
        
        return {
            'overall': round(total_score, 2),
            'breakdown': {k: round(v, 2) for k, v in scores.items()},
            'weights': cls.WEIGHTS,
        }
    
    @staticmethod
    def _calculate_color_score(products: List[Any]) -> float:
        """Calculate color harmony score."""
        return ColorService.get_outfit_color_score(products)
    
    @staticmethod
    def _calculate_style_score(products: List[Any]) -> float:
        """Calculate style consistency score."""
        if len(products) < 2:
            return 1.0
        
        # Get style from product dict or object
        def get_style(p):
            if isinstance(p, dict):
                return p.get('style', 'casual')
            return getattr(p, 'style', 'casual')
        
        styles = [get_style(p) for p in products]
        base_style = styles[0]
        
        match_count = 0
        for style in styles[1:]:
            compatible = STYLE_COMPATIBILITY.get(base_style, [])
            if style == base_style:
                match_count += 1
            elif style in compatible:
                match_count += 0.7
        
        return match_count / (len(styles) - 1) if len(styles) > 1 else 1.0
    
    @staticmethod
    def _calculate_occasion_score(products: List[Any], target_occasion: Optional[str]) -> float:
        """Calculate occasion appropriateness score."""
        if not target_occasion:
            return 0.8  # Default score if no occasion specified
        
        def get_occasions(p):
            if isinstance(p, dict):
                return p.get('occasions', [])
            return list(p.occasions.values_list('occasion', flat=True)) if hasattr(p, 'occasions') else []
        
        match_count = 0
        for product in products:
            occasions = get_occasions(product)
            if target_occasion in occasions:
                match_count += 1
        
        return match_count / len(products) if products else 0.8
    
    @staticmethod
    def _calculate_season_score(products: List[Any], target_season: Optional[str]) -> float:
        """Calculate season match score."""
        if not target_season:
            return 0.8  # Default score if no season specified
        
        compatible_seasons = SEASON_COMPATIBILITY.get(target_season, [target_season, 'all'])
        
        def get_seasons(p):
            if isinstance(p, dict):
                return p.get('seasons', ['all'])
            return list(p.seasons.values_list('season', flat=True)) if hasattr(p, 'seasons') else ['all']
        
        match_count = 0
        for product in products:
            seasons = get_seasons(product)
            has_match = any(s in compatible_seasons or s == 'all' for s in seasons)
            if has_match:
                match_count += 1
        
        return match_count / len(products) if products else 0.8
    
    @staticmethod
    def _calculate_budget_score(products: List[Any], target_budget: Optional[str]) -> float:
        """Calculate budget alignment score."""
        if not target_budget:
            return 0.8  # Default score if no budget specified
        
        target_range = PRICE_RANGES.get(target_budget)
        if not target_range:
            return 0.8
        
        def get_price_range(p):
            if isinstance(p, dict):
                return p.get('price_range', 'mid')
            return getattr(p, 'price_range', 'mid')
        
        match_count = 0
        for product in products:
            product_range = PRICE_RANGES.get(get_price_range(product))
            if not product_range:
                continue
            
            if get_price_range(product) == target_budget:
                match_count += 1
            elif abs(product_range['order'] - target_range['order']) == 1:
                match_count += 0.7  # Adjacent price range
            else:
                match_count += 0.3
        
        return match_count / len(products) if products else 0.8
    
    @staticmethod
    def get_score_explanation(score_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Get human-readable score explanation.
        """
        overall = score_data['overall']
        breakdown = score_data['breakdown']
        
        explanations = []
        
        if breakdown['color_harmony'] >= 0.8:
            explanations.append("Excellent color coordination")
        elif breakdown['color_harmony'] >= 0.6:
            explanations.append("Good color matching")
        else:
            explanations.append("Colors could be better coordinated")
        
        if breakdown['style_match'] >= 0.8:
            explanations.append("Consistent style throughout")
        elif breakdown['style_match'] >= 0.6:
            explanations.append("Styles work well together")
        
        if breakdown['occasion_fit'] >= 0.8:
            explanations.append("Perfect for the occasion")
        
        if breakdown['season_match'] >= 0.8:
            explanations.append("Season-appropriate choices")
        
        if overall >= 0.85:
            rating = "Excellent"
        elif overall >= 0.70:
            rating = "Good"
        elif overall >= 0.55:
            rating = "Fair"
        else:
            rating = "Needs Improvement"
        
        return {
            'rating': rating,
            'details': explanations,
        }