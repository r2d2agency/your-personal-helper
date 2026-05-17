import { motion } from "framer-motion";

interface SectionWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  bg?: "white" | "gray" | "primary";
  className?: string;
}

export function SectionWrapper({ 
  children, 
  title, 
  subtitle, 
  bg = "white",
  className = "" 
}: SectionWrapperProps) {
  const bgClasses = {
    white: "bg-white",
    gray: "bg-gray-50",
    primary: "bg-primary text-white"
  };

  return (
    <section className={`py-20 ${bgClasses[bg]} ${className}`}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="max-w-3xl mb-12">
            {subtitle && (
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`text-sm font-black uppercase tracking-widest ${bg === 'primary' ? 'text-white/80' : 'text-primary'}`}
              >
                {subtitle}
              </motion.span>
            )}
            {title && (
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-black mt-2 leading-tight"
              >
                {title}
              </motion.h2>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
