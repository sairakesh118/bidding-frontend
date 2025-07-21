import React from 'react';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage = () => {
  const handleGoHome = () => {
    // Replace with your navigation logic
    // navigate('/') or window.location.href = '/'
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-9xl font-bold text-gray-200 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-16 h-16 text-blue-400 animate-pulse" />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-800">
              Oops! Page Not Found
            </h2>
            <p className="text-gray-600 text-lg">
              The page you're looking for seems to have wandered off into the digital void.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              onClick={handleGoHome}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </button>

            <button
              onClick={handleGoBack}
              className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-full font-medium border border-gray-200 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Footer Text */}
        <p className="mt-8 text-sm text-gray-500">
          Error Code: 404 | Page Not Found
        </p>
      </div>

      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
      </div>
    </div>
  );
};

export default NotFoundPage;