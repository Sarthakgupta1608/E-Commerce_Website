// src/components/checkout/PaymentMethod.jsx
import React from 'react';
import { CreditCard, Landmark, ShieldCheck } from 'lucide-react';

export default function PaymentMethod() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center space-x-2 border border-indigo-600 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg cursor-pointer">
          <CreditCard className="w-5 h-5" />
          <span>Credit Card</span>
        </div>
        <div className="flex items-center space-x-2 border border-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100">
          <Landmark className="w-5 h-5" />
          <span>Bank Transfer</span>
        </div>
        <div className="flex items-center justify-center border border-gray-300 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100">
          <img src="https://www.paypalobjects.com/images/shared/paypal-logo-129x32.svg" alt="PayPal" className="h-5" />
        </div>
      </div>

      <form className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="cardName" className="text-sm font-medium text-gray-700">Name on Card</label>
          <input type="text" id="cardName" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Jayesh Saini" />
        </div>
        <div className="space-y-2">
          <label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">Card Number</label>
          <input type="text" id="cardNumber" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="1234 5678 9012 3456" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="expiry" className="text-sm font-medium text-gray-700">Expiry Date</label>
            <input type="text" id="expiry" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="MM / YY" />
          </div>
          <div className="space-y-2">
            <label htmlFor="cvc" className="text-sm font-medium text-gray-700">CVC</label>
            <input type="text" id="cvc" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="123" />
          </div>
        </div>
        <p className="flex items-center text-sm text-gray-500 mt-4">
          <ShieldCheck className="w-4 h-4 mr-2" /> All transactions are secure and encrypted.
        </p>
      </form>
    </div>
  );
}