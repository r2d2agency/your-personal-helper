import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export function FAQSection({ faqs }: { faqs: FAQ[] }) {
  if (faqs.length === 0) return null;

  return (
    <SectionWrapper 
      title="Dúvidas Frequentes" 
      subtitle="FAQ"
      bg="gray"
    >
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <AccordionItem value={faq.id} className="bg-white rounded-2xl border-none px-6 shadow-sm">
                <AccordionTrigger className="hover:no-underline font-bold text-lg py-6 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </SectionWrapper>
  );
}
