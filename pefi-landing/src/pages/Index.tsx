
import React from 'react';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Benefits from '@/components/Benefits';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import ContactInfo from '@/components/ContactInfo';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

const Index = () => {
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <Hero />
      <Features />
      <Benefits />
      
      {/* CTA Section */}
      <section className="py-16 bg-finance-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join thousands of satisfied users and take control of your finances!
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Start your journey to financial freedom today with our comprehensive tools and personalized insights.
          </p>
          <Button className="bg-white text-finance-primary hover:bg-gray-100 text-lg px-8 py-6">
            Download Now
          </Button>
        </div>
      </section>
      
      <Testimonials />
      <Pricing />
      <FAQ />
      <ContactInfo />
      <Footer />
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-finance-primary text-white p-3 rounded-full shadow-lg hover:bg-opacity-90 transition-all z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
};

export default Index;
