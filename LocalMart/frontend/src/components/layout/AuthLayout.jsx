// src/components/layout/AuthLayout.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';

export default function AuthLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
            <Link to="/" className="flex items-center justify-center">
              <div className="bg-indigo-600 p-2 rounded-full">
                <Store className="h-8 w-8 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">
                LocalMart
              </span>
            </Link>

            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {title}
            </h2>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}