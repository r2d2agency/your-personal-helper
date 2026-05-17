import { SectionWrapper } from "./SectionWrapper";
import { Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  content: string;
  image_url: string | null;
}

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <SectionWrapper 
      title="Quem já conhece recomenda" 
      subtitle="Depoimentos"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-[var(--gray-50)] p-8 rounded-[2rem] relative space-y-6 flex flex-col justify-between"
          >
            <Quote className="absolute top-6 right-8 w-12 h-12 text-primary/10" />
            <p className="text-muted-foreground italic leading-relaxed z-10">
              "{t.content}"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                <img 
                  src={t.image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`} 
                  alt={t.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold">{t.name}</h4>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">{t.role || "Cliente"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
