
import React from 'react';
import { PieChart, TrendingUp, Target, LineChart } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <PieChart size={36} className="text-finance-primary" />,
      title: "Budgeting Tools",
      description: "Set personalized budgets across various categories and track your spending habits to stay on financial track."
    },
    {
      icon: <TrendingUp size={36} className="text-finance-primary" />,
      title: "Expense Tracking",
      description: "Automatically categorize and monitor your expenses with real-time updates and insights into your spending patterns."
    },
    {
      icon: <Target size={36} className="text-finance-primary" />,
      title: "Savings Goals",
      description: "Define your savings objectives and track your progress with visual tools that keep you motivated."
    },
    {
      icon: <LineChart size={36} className="text-finance-primary" />,
      title: "Investment Insights",
      description: "Access expert guidance on investing strategies tailored to your financial situation and future goals."
    }
  ];

  return (
    <section id="features" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-4">Powerful Features</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our comprehensive suite of financial tools helps you manage every aspect of your finances in one place.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-finance-light p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
