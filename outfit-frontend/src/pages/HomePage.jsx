import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Palette, Zap, ShoppingBag, ArrowRight, Check } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Palette,
      title: 'Color Harmony',
      description: 'Our AI analyzes color combinations to ensure your outfit looks perfectly coordinated.',
    },
    {
      icon: Sparkles,
      title: 'Style Matching',
      description: 'Match formal with formal, casual with casual - our system understands fashion rules.',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get personalized outfit recommendations in under 1 second.',
    },
  ];

  const steps = [
    'Browse our curated collection of products',
    'Select any item you love',
    'Get instant AI-powered outfit recommendations',
    'Shop the complete look',
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Personal
              <span className="block text-primary-200">AI Fashion Stylist</span>
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Get instant, personalized outfit recommendations powered by artificial intelligence. 
              Select any piece, and we'll style the perfect look for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="btn btn-lg bg-white text-primary-700 hover:bg-primary-50">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Browse Products
              </Link>
              <Link to="/recommendations" className="btn btn-lg border-2 border-white text-white hover:bg-white/10">
                <Sparkles className="w-5 h-5 mr-2" />
                Get Styled
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Our AI Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our intelligent system analyzes multiple factors to create perfectly coordinated outfits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-colors">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 text-primary-600 rounded-xl mb-4">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple 4-Step Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting styled has never been easier
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start mb-6 last:mb-0">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  {index + 1}
                </div>
                <div className="flex-1 bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-gray-700 font-medium">{step}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products" className="btn btn-primary btn-lg">
              Start Styling Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Wardrobe?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands who've discovered their perfect style with our AI stylist
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['Color harmony analysis', 'Style matching', 'Occasion-based recommendations', 'Season-appropriate outfits'].map((item, i) => (
              <div key={i} className="flex items-center bg-white/10 rounded-full px-4 py-2">
                <Check className="w-4 h-4 mr-2 text-primary-300" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
          <Link to="/recommendations" className="btn btn-lg bg-white text-primary-700 hover:bg-primary-50">
            <Sparkles className="w-5 h-5 mr-2" />
            Get Your Personalized Style
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;