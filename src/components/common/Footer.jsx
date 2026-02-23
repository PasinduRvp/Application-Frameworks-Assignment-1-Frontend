import React from 'react';
import { Ship, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Logo & Brand */}
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <Ship className="text-ocean-600" size={24} />
                        <span className="text-xl font-bold text-gray-900">EcoNav</span>
                    </div>

                    {/* Navigation/Links */}
                    <div className="flex space-x-6 text-sm text-gray-500 mb-4 md:mb-0">
                        <button className="hover:text-ocean-600 transition-colors">Documentation</button>
                        <button className="hover:text-ocean-600 transition-colors">Privacy Policy</button>
                        <button className="hover:text-ocean-600 transition-colors">Terms of Service</button>
                        <button className="hover:text-ocean-600 transition-colors">Contact Support</button>
                    </div>

                    {/* Copyright */}
                    <div className="text-sm text-gray-500 flex items-center">
                        <span>&copy; {new Date().getFullYear()} EcoNav Project.</span>
                        <span className="ml-2 flex items-center">
                            Made with <Heart size={14} className="mx-1 text-red-500" /> for the ocean.
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
