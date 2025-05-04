
import React from 'react';
import { Smile, Clock, Zap } from 'lucide-react';

const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: <Smile size={48} className="text-finance-primary" />,
      title: "User-Friendly Interface",
      description: "Navigate with ease through our intuitive interface designed for users of all technical skill levels."
    },
    {
      icon: <Clock size={48} className="text-finance-primary" />,
      title: "Real-Time Data",
      description: "Stay informed with instant updates on your financial status, allowing you to make timely decisions."
    },
    {
      icon: <Zap size={48} className="text-finance-primary" />,
      title: "Personalized Recommendations",
      description: "Receive custom advice based on your spending habits and financial goals for optimized money management."
    }
  ];

  return (
    <section id="benefits" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-4">Why Choose FinanceWise</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We provide tools that make managing your finances simpler, smarter, and more effective.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="flex justify-center mb-6">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
