"""
Fashion constants and rules for the recommendation system.
"""

# Color groups for matching
COLOR_GROUPS = {
    'neutrals': ['white', 'black', 'gray', 'grey', 'beige', 'cream', 'ivory', 'charcoal'],
    'blues': ['blue', 'navy', 'light_blue', 'royal_blue', 'sky_blue', 'teal', 'turquoise'],
    'earthy': ['brown', 'tan', 'khaki', 'olive', 'camel', 'burgundy', 'maroon', 'rust'],
    'warm': ['red', 'orange', 'yellow', 'coral', 'peach', 'gold'],
    'cool': ['green', 'purple', 'pink', 'lavender', 'mint'],
}

# Colors that go well together
COLOR_HARMONY = {
    # Neutral colors go with everything
    'white': ['all'],
    'black': ['all'],
    'gray': ['all'],
    'grey': ['all'],
    'beige': ['all'],
    'cream': ['all'],
    
    # Blue family
    'navy': ['white', 'gray', 'beige', 'khaki', 'brown', 'tan', 'light_blue', 'pink', 'burgundy', 'cream'],
    'blue': ['white', 'gray', 'beige', 'khaki', 'brown', 'navy', 'tan', 'cream'],
    'light_blue': ['white', 'navy', 'gray', 'beige', 'khaki', 'brown', 'tan', 'pink', 'cream'],
    
    # Earth tones
    'brown': ['white', 'beige', 'navy', 'blue', 'green', 'olive', 'tan', 'cream', 'khaki'],
    'tan': ['white', 'navy', 'blue', 'brown', 'olive', 'burgundy', 'green', 'cream'],
    'khaki': ['white', 'navy', 'blue', 'brown', 'olive', 'burgundy', 'black', 'cream'],
    'olive': ['white', 'beige', 'khaki', 'tan', 'brown', 'navy', 'cream', 'gray'],
    'burgundy': ['white', 'gray', 'beige', 'navy', 'tan', 'khaki', 'cream', 'black'],
    
    # Warm colors
    'red': ['white', 'black', 'gray', 'navy', 'beige', 'blue'],
    'pink': ['white', 'gray', 'navy', 'blue', 'beige', 'black'],
    
    # Cool colors
    'green': ['white', 'beige', 'khaki', 'brown', 'tan', 'navy', 'gray'],
    
    # Metallics (for accessories)
    'silver': ['all'],
    'gold': ['navy', 'black', 'brown', 'white', 'burgundy', 'olive'],
}

# Style compatibility matrix
STYLE_COMPATIBILITY = {
    'formal': ['formal', 'smart_casual'],
    'smart_casual': ['formal', 'smart_casual', 'casual'],
    'casual': ['smart_casual', 'casual', 'sporty'],
    'sporty': ['casual', 'sporty'],
}

# Occasion compatibility
OCCASION_MAPPING = {
    'office': ['formal', 'smart_casual'],
    'wedding': ['formal'],
    'interview': ['formal'],
    'casual': ['casual', 'smart_casual'],
    'date': ['smart_casual', 'casual'],
    'party': ['smart_casual', 'casual'],
    'beach': ['casual'],
    'vacation': ['casual'],
    'weekend': ['casual'],
    'outdoor': ['casual', 'sporty'],
    'formal': ['formal'],
    'brunch': ['smart_casual', 'casual'],
}

# Price range values
PRICE_RANGES = {
    'budget': {'min': 0, 'max': 50, 'order': 0},
    'mid': {'min': 50, 'max': 150, 'order': 1},
    'premium': {'min': 150, 'max': 300, 'order': 2},
    'luxury': {'min': 300, 'max': float('inf'), 'order': 3}
}

# Season compatibility
SEASON_COMPATIBILITY = {
    'summer': ['summer', 'all'],
    'winter': ['winter', 'all'],
    'spring': ['spring', 'summer', 'all'],
    'fall': ['fall', 'winter', 'all'],
    'all': ['summer', 'winter', 'spring', 'fall', 'all']
}

# Required categories for a complete outfit
OUTFIT_CATEGORIES = ['top', 'bottom', 'footwear', 'accessory']

# Scoring weights
SCORING_WEIGHTS = {
    'color_harmony': 0.30,
    'style_match': 0.25,
    'occasion_fit': 0.20,
    'season_match': 0.15,
    'budget_alignment': 0.10,
}