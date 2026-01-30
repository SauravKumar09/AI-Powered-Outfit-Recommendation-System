import React from 'react';
import { Heart, Github, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-gray-900">
              AI Outfit Stylist
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Intelligent fashion recommendations powered by AI
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="mailto:contact@example.com"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          <div className="flex items-center text-sm text-gray-500">
            Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for fashion
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;