
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white py-4 sticky top-0 z-50 shadow-sm">
      <div className="container-custom flex justify-between items-center">
        <div className="flex items-center">
          <a href="#" className="flex items-center">
            <span className="text-finance-primary text-2xl font-bold">FinanceWise</span>
          </a>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-700 hover:text-finance-primary font-medium">Features</a>
          <a href="#benefits" className="text-gray-700 hover:text-finance-primary font-medium">Benefits</a>
          <a href="#testimonials" className="text-gray-700 hover:text-finance-primary font-medium">Testimonials</a>
          <a href="#pricing" className="text-gray-700 hover:text-finance-primary font-medium">Pricing</a>
          <a href="#faq" className="text-gray-700 hover:text-finance-primary font-medium">FAQ</a>
          <Button className="btn-primary">Get Started</Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-700">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-lg animate-fade-in">
          <div className="flex flex-col space-y-4">
            <a href="#features" className="text-gray-700 hover:text-finance-primary font-medium" onClick={toggleMenu}>Features</a>
            <a href="#benefits" className="text-gray-700 hover:text-finance-primary font-medium" onClick={toggleMenu}>Benefits</a>
            <a href="#testimonials" className="text-gray-700 hover:text-finance-primary font-medium" onClick={toggleMenu}>Testimonials</a>
            <a href="#pricing" className="text-gray-700 hover:text-finance-primary font-medium" onClick={toggleMenu}>Pricing</a>
            <a href="#faq" className="text-gray-700 hover:text-finance-primary font-medium" onClick={toggleMenu}>FAQ</a>
            <Button className="btn-primary w-full">Get Started</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
