export function SectionWrapper({ 
  children, 
  title, 
  subtitle, 
  bg = "white",
  className = "" 
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  bg?: "white" | "gray" | "primary";
  className?: string;
}) {
  const bgClasses = {
    white: "bg-white",
    gray: "bg-[var(--gray-50)]",
    primary: "bg-primary text-white"
  };

  return (
    <section className={`py-20 ${bgClasses[bg]} ${className}`}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="max-w-3xl mb-12">
            {subtitle && (
              <span className={`text-sm font-black uppercase tracking-widest ${bg === 'primary' ? 'text-white/80' : 'text-primary'}`}>
                {subtitle}
              </span>
            )}
            {title && (
              <h2 className="text-4xl md:text-5xl font-black mt-2 leading-tight">
                {title}
              </h2>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
