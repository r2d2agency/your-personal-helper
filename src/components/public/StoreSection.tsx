import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "./SectionWrapper";
import { MapPin, Clock, Phone } from "lucide-react";

interface Store {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  opening_hours: string | null;
  neighborhood: string | null;
}

export function StoreSection({ stores }: { stores: Store[] }) {
  if (stores.length === 0) return null;

  return (
    <SectionWrapper 
      title="Venha nos visitar em uma de nossas unidades" 
      subtitle="Nossas Lojas"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stores.map((store, i) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group"
          >
            <div className="bg-white p-8 rounded-[2rem] border-2 border-transparent group-hover:border-primary transition-all duration-300 h-full flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors">
                  <MapPin className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2">{store.name}</h3>
                  <p className="text-muted-foreground text-sm font-medium">{store.neighborhood || "Unidade"}</p>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{store.address || "Endereço em breve"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <span>{store.opening_hours || "08h às 18h"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <span>{store.phone || "(00) 0000-0000"}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full rounded-xl font-bold group-hover:bg-primary group-hover:text-white transition-all">
                Ver no Mapa
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
