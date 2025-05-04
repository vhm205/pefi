
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      quote: "FinanceWise has completely transformed how I manage both my personal and business finances. The budgeting tools have helped me save 20% more each month!"
    },
    {
      name: "Michael Chen",
      role: "Graduate Student",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      quote: "As a student with limited income, this app has been a game-changer. I can now track every expense and have finally started building my emergency fund."
    },
    {
      name: "Jessica Williams",
      role: "Marketing Professional",
      image: "https://randomuser.me/api/portraits/women/63.jpg",
      quote: "The investment insights feature guided me through starting my investment journey. I'm now much more confident about my financial future."
    }
  ];

  const renderStars = () => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} size={16} fill="#FFD700" color="#FFD700" />
    ));
  };

  return (
    <section id="testimonials" className="section-padding bg-finance-light">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied users who have transformed their financial lives with FinanceWise.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-center mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars()}
                </div>
              </div>
              <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
