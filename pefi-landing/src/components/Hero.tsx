
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-finance-light to-white py-16 md:py-28">
      <div className="container-custom flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-finance-dark leading-tight mb-4">
            Take Control of Your <span className="text-finance-primary">Finances Today</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Your all-in-one personal finance assistant to help you budget, save, and invest smarter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="btn-primary flex items-center gap-2 text-base">
              Get Started <ArrowRight size={18} />
            </Button>
            <Button variant="outline" className="border-finance-primary text-finance-primary hover:bg-finance-light text-base">
              Learn More
            </Button>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="relative w-full max-w-md">
            <div className="absolute -top-4 -right-4 w-full h-full bg-finance-secondary rounded-xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
              alt="FinanceWise App Demo" 
              className="rounded-xl shadow-lg relative z-10 w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
