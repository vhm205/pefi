
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, FileText, User } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

const Pricing: React.FC = () => {
  const pricingOptions = [
    {
      title: "Get Started for Free",
      price: "$0",
      description: "Open-source access to our platform with basic features.",
      features: [
        "Basic budgeting tools",
        "Manual expense tracking",
        "Community support",
        "Limited reports",
        "Open-source access"
      ],
      icon: <FileText className="h-10 w-10 text-finance-primary mb-4" />,
      buttonText: "Get Started",
      isPopular: false
    },
    {
      title: "Consult and Deploy",
      price: "$5",
      description: "Personalized consultation and deployment assistance via your email.",
      features: [
        "All free features",
        "Personalized setup",
        "Expert guidance",
        "Tailored recommendations",
        "Priority email support"
      ],
      icon: <User className="h-10 w-10 text-finance-primary mb-4" />,
      buttonText: "Get Consultation",
      isPopular: true
    }
  ];

  return (
    <section id="pricing" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose the option that fits your financial needs with our flexible pricing options.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingOptions.map((option, index) => (
            <Card 
              key={index} 
              className={`overflow-hidden transition-all hover:shadow-lg ${
                option.isPopular ? 'border-finance-primary ring-2 ring-finance-primary/20' : 'border-gray-100'
              }`}
            >
              {option.isPopular && (
                <div className="bg-finance-primary text-white text-center py-2">
                  <p className="font-medium">Recommended</p>
                </div>
              )}
              
              <CardHeader className="text-center pt-8">
                {option.icon}
                <h3 className="text-2xl font-bold mb-2">{option.title}</h3>
                <div className="mb-3">
                  <span className="text-4xl font-bold">{option.price}</span>
                </div>
                <p className="text-gray-600">{option.description}</p>
              </CardHeader>
              
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {option.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check size={18} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="pt-0 pb-8">
                <Button 
                  className={`w-full ${option.isPopular ? 'bg-finance-primary text-white hover:bg-finance-primary/90' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
                >
                  {option.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-500">
            All plans include our core financial management tools. 
            Need something custom? <a href="#contact" className="text-finance-primary hover:underline">Contact us</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
