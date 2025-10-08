import { useEffect, useState } from "react";
import FaqAccordionItem from "./FaqAccordionItem";

export const revalidate = 3600;

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<null | number>(null);

  useEffect(() => {}, []);

  const faqs = [
    {
      question: "How do I apply to become a chef with Chef On Demand?",
      answer:
        "Simply apply by filling out the application form on our website. Provide details about your experience, the type of cuisine you specialize in, the areas you are available to serve, and confirm that you meet the necessary requirements to work as a private chef.",
    },
    {
      question: "What happens after I submit my application?",
      answer:
        "Once you submit your application, a member of our team will review your profile and reach out when a client in your area requests a service. We’ll discuss client preferences, budget, and other details with you to ensure everything is a perfect fit.",
    },
    {
      question: "Do I need to pay any fees to join Chef On Demand?",
      answer:
        "No, there are zero marketing costs or subscription fees to join Chef On Demand. You only earn from the clients we bring directly to you.",
    },
    {
      question: "How do I get clients once I join?",
      answer:
        "Chef On Demand handles all client inquiries, bookings, and communication. Once we match you with a client in your area, we’ll take care of the booking process so you can focus solely on cooking and serving.",
    },
    {
      question: "Can I choose where and when to work?",
      answer:
        "Yes, during the application process, you will specify the areas you’re available to serve. You can also control the number of clients you accept based on your schedule.",
    },
    {
      question: "How do bookings and payments work?",
      answer:
        "Once a client accepts your proposal, we handle the booking and payment process. You will receive payment after the service is completed, with no hidden fees or marketing costs deducted.",
    },
  ];

  const toggleAccordion = (index: number | null) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="px-4 py-12">
      <div className="mx-auto justify-center md:flex md:gap-20">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold">Domande Frequenti</h1>
          <p className="text-lg text-white/70">
            Al tuo tavolo non c&apos;è spazio per i dubbi.
          </p>
        </div>

        <div className="w-2/3 justify-self-center border-l-2 border-[#c8a36a] pl-4 md:w-1/2">
          <div>
            {faqs.map((faq, index) => (
              <FaqAccordionItem
                openIndex={openIndex}
                key={index}
                faq={faq}
                index={index}
                actualIndex={index}
                toggleAccordion={toggleAccordion}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
