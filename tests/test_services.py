"""
Tests for the recommendation services.
"""

import pytest
from apps.recommendations.services.color_service import ColorService
from apps.recommendations.services.scoring_service import ScoringService


class TestColorService:
    """Tests for ColorService."""
    
    def test_compatible_colors(self):
        """Test that compatible colors are identified correctly."""
        assert ColorService.are_colors_compatible('navy', 'white') is True
        assert ColorService.are_colors_compatible('black', 'white') is True
        assert ColorService.are_colors_compatible('blue', 'khaki') is True
        assert ColorService.are_colors_compatible('brown', 'navy') is True
    
    def test_color_harmony_score_range(self):
        """Test that color harmony scores are within valid range."""
        score = ColorService.get_color_harmony_score('navy', 'white')
        assert 0 <= score <= 1
        
        score = ColorService.get_color_harmony_score('red', 'green')
        assert 0 <= score <= 1
    
    def test_neutral_colors_match_everything(self):
        """Test that neutral colors match with most colors."""
        assert ColorService.are_colors_compatible('white', 'navy') is True
        assert ColorService.are_colors_compatible('white', 'red') is True
        assert ColorService.are_colors_compatible('black', 'blue') is True
        assert ColorService.are_colors_compatible('gray', 'brown') is True
    
    def test_outfit_color_score(self):
        """Test outfit color score calculation."""
        products = [
            {'color': 'navy'},
            {'color': 'white'},
            {'color': 'brown'},
        ]
        score = ColorService.get_outfit_color_score(products)
        assert 0 <= score <= 1


class TestScoringService:
    """Tests for ScoringService."""
    
    def test_calculate_outfit_score(self):
        """Test outfit score calculation."""
        outfit = {
            'top': {
                'color': 'navy',
                'style': 'formal',
                'price_range': 'mid',
                'occasions': ['office'],
                'seasons': ['all'],
            },
            'bottom': {
                'color': 'black',
                'style': 'formal',
                'price_range': 'mid',
                'occasions': ['office'],
                'seasons': ['all'],
            },
            'footwear': {
                'color': 'brown',
                'style': 'formal',
                'price_range': 'premium',
                'occasions': ['office'],
                'seasons': ['all'],
            },
            'accessories': [{
                'color': 'brown',
                'style': 'formal',
                'price_range': 'mid',
                'occasions': ['office'],
                'seasons': ['all'],
            }],
        }
        
        score_data = ScoringService.calculate_outfit_score(outfit, {'occasion': 'office'})
        
        assert 'overall' in score_data
        assert 'breakdown' in score_data
        assert 0 <= score_data['overall'] <= 1
    
    def test_score_explanation(self):
        """Test score explanation generation."""
        score_data = {
            'overall': 0.85,
            'breakdown': {
                'color_harmony': 0.9,
                'style_match': 0.8,
                'occasion_fit': 0.85,
                'season_match': 0.8,
                'budget_alignment': 0.7,
            },
        }
        
        explanation = ScoringService.get_score_explanation(score_data)
        
        assert 'rating' in explanation
        assert 'details' in explanation
        assert isinstance(explanation['details'], list)