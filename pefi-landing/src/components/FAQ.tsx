
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "How does the app keep my data secure?",
      answer: "We use bank-level 256-bit encryption to protect your financial data. Your information is never sold to third parties, and we employ multiple security measures including two-factor authentication and continuous security monitoring."
    },
    {
      question: "Can I sync my bank accounts?",
      answer: "Yes, you can securely connect your bank accounts, credit cards, investments, and loans to get a complete picture of your finances. We support over 10,000 financial institutions across the country."
    },
    {
      question: "Is customer support available?",
      answer: "Absolutely. We offer email support for all users, with priority and 24/7 support for paid subscribers. Our knowledgeable support team is ready to assist with any questions or issues."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time through your account settings. If you cancel, you'll continue to have access to your paid features until the end of your billing period."
    },
    {
      question: "Does the app work on all devices?",
      answer: "FinanceWise works on iOS and Android mobile devices, as well as on desktop through our web application. Your data syncs seamlessly across all your devices."
    },
    {
      question: "How accurate is the automatic expense categorization?",
      answer: "Our expense categorization system uses machine learning to achieve over 95% accuracy. You can also manually adjust any miscategorized transactions, and our system will learn from your corrections."
    }
  ];

  return (
    <section id="faq" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about FinanceWise and its features.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold hover:text-finance-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
