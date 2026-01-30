"""
Color service for handling color matching logic.
"""

from .constants import COLOR_HARMONY, COLOR_GROUPS


class ColorService:
    """
    Service for color compatibility and harmony calculations.
    """
    
    @staticmethod
    def are_colors_compatible(color1: str, color2: str) -> bool:
        """
        Check if two colors are compatible.
        """
        c1 = color1.lower()
        c2 = color2.lower()
        
        # Same color family is usually compatible
        if c1 == c2:
            return True
        
        # Check if either color matches with 'all'
        harmony1 = COLOR_HARMONY.get(c1, [])
        harmony2 = COLOR_HARMONY.get(c2, [])
        
        if 'all' in harmony1 or 'all' in harmony2:
            return True
        
        # Check specific color harmony
        if c2 in harmony1 or c1 in harmony2:
            return True
        
        # Check if both are neutrals
        if c1 in COLOR_GROUPS['neutrals'] and c2 in COLOR_GROUPS['neutrals']:
            return True
        
        return False
    
    @staticmethod
    def get_color_harmony_score(color1: str, color2: str) -> float:
        """
        Calculate color harmony score between two colors.
        Returns a score between 0 and 1.
        """
        c1 = color1.lower()
        c2 = color2.lower()
        
        # Exact match - good but not perfect for variety
        if c1 == c2:
            return 0.7
        
        # Check if either is a universal match
        harmony1 = COLOR_HARMONY.get(c1, [])
        harmony2 = COLOR_HARMONY.get(c2, [])
        
        if 'all' in harmony1 or 'all' in harmony2:
            return 0.9
        
        # Direct color harmony match
        if c2 in harmony1 or c1 in harmony2:
            return 1.0
        
        # Both neutrals
        if c1 in COLOR_GROUPS['neutrals'] and c2 in COLOR_GROUPS['neutrals']:
            return 0.85
        
        # Same color family
        for group in COLOR_GROUPS.values():
            if c1 in group and c2 in group:
                return 0.75
        
        # No match found
        return 0.3
    
    @classmethod
    def get_outfit_color_score(cls, products: list) -> float:
        """
        Calculate overall color harmony for an outfit.
        """
        if len(products) < 2:
            return 1.0
        
        total_score = 0
        comparisons = 0
        
        for i in range(len(products)):
            for j in range(i + 1, len(products)):
                color1 = products[i].get('color', products[i].color if hasattr(products[i], 'color') else 'white')
                color2 = products[j].get('color', products[j].color if hasattr(products[j], 'color') else 'white')
                total_score += cls.get_color_harmony_score(color1, color2)
                comparisons += 1
        
        return total_score / comparisons if comparisons > 0 else 1.0