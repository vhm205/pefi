
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactInfo: React.FC = () => {
  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-4">Get In Touch</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Have questions or need assistance? Our team is here to help you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center p-6">
            <div className="bg-finance-light p-4 rounded-full mb-4">
              <Mail size={24} className="text-finance-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Email</h3>
            <a href="mailto:support@personalfinanceapp.com" className="text-finance-primary hover:underline">
              support@personalfinanceapp.com
            </a>
          </div>
          
          <div className="flex flex-col items-center text-center p-6">
            <div className="bg-finance-light p-4 rounded-full mb-4">
              <Phone size={24} className="text-finance-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Phone</h3>
            <a href="tel:+1-123-456-7890" className="text-finance-primary hover:underline">
              (123) 456-7890
            </a>
          </div>
          
          <div className="flex flex-col items-center text-center p-6">
            <div className="bg-finance-light p-4 rounded-full mb-4">
              <MapPin size={24} className="text-finance-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Address</h3>
            <p className="text-gray-600">
              123 Finance Street<br />
              New York, NY 10001
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
