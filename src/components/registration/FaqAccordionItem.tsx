export const revalidate = 3600;

interface FaqAccordionItemInterface {
  faq: { question: string; answer: string };
  index: number;
  actualIndex: number;
  openIndex: number | null;
  toggleAccordion: Function;
}

export default function FaqAccordioItem({
  faq,
  actualIndex,
  toggleAccordion,
  openIndex,
}: FaqAccordionItemInterface) {
  return (
    <div className="mb-3 transform overflow-hidden rounded-lg text-[#c8a36a] transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
      <button
        onClick={() => toggleAccordion(actualIndex)}
        className={`flex w-full items-center justify-between px-6 py-4 text-left transition-all duration-300 ${openIndex === actualIndex ? "rounded-t-lg border-1" : ""} `}
      >
        <span className="font-medium text-white">{faq.question}</span>
      </button>
      <div
        className={`overflow-hidden px-6 text-white transition-all duration-500 ease-in-out ${
          openIndex === actualIndex
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="animate-fadeIn">{faq.answer}</div>
      </div>
    </div>
  );
}
