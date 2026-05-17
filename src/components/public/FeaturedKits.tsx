import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "./SectionWrapper";
import { Users, Layout } from "lucide-react";

interface Kit {
  id: string;
  name: string;
  theme: string | null;
  approx_people: number | null;
  image_cover: string | null;
  description: string | null;
}

export function FeaturedKits({ kits }: { kits: Kit[] }) {
  if (kits.length === 0) return null;

  return (
    <SectionWrapper 
      title="Festas completas prontas para você" 
      subtitle="Kits Pegue e Monte"
      bg="gray"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {kits.map((kit, i) => (
          <motion.div
            key={kit.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group"
          >
            <div className="aspect-[4/3] overflow-hidden relative">
              <img 
                src={kit.image_cover || 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&q=80&w=800'} 
                alt={kit.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                {kit.theme || "Festa"}
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black leading-tight">{kit.name}</h3>
                <div className="flex items-center gap-1.5 text-primary bg-primary/10 px-3 py-1 rounded-full text-xs font-bold">
                  <Users className="w-3.5 h-3.5" />
                  {kit.approx_people || 20} pessoas
                </div>
              </div>
              <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                {kit.description || "Tudo o que você precisa para uma festa completa, prática e inesquecível."}
              </p>
              <Button className="w-full rounded-2xl h-12 font-bold shadow-lg shadow-primary/20">
                Ver Detalhes
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Button variant="outline" size="lg" className="rounded-full font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white">
          Ver Todos os Kits
        </Button>
      </div>
    </SectionWrapper>
  );
}
