import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getPublicHomeData } from "@/lib/cms-queries";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { BannerCarousel } from "@/components/public/BannerCarousel";
import { CategoryGrid } from "@/components/public/CategoryGrid";
import { FeaturedKits } from "@/components/public/FeaturedKits";
import { CourseSection } from "@/components/public/CourseSection";
import { StoreSection } from "@/components/public/StoreSection";
import { FAQSection } from "@/components/public/FAQSection";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const fetchHome = useServerFn(getPublicHomeData);
  const { data: homeData } = useSuspenseQuery({
    queryKey: ["public-home"],
    queryFn: () => fetchHome(),
  });
  
  const { modules, data } = homeData;

  const renderModule = (module: any) => {
    const moduleData = (data as any)[module.slug];
    if (!moduleData || moduleData.length === 0) return null;
    
    switch (module.slug) {
      case "banners":
        return <BannerCarousel key={module.id} banners={moduleData} />;
      case "categories":
        return <CategoryGrid key={module.id} categories={moduleData} />;
      case "kits":
        return <FeaturedKits key={module.id} kits={moduleData} />;
      case "courses":
        return <CourseSection key={module.id} courses={moduleData} />;
      case "stores":
        return <StoreSection key={module.id} stores={moduleData} />;
      case "faq":
        return <FAQSection key={module.id} faqs={moduleData} />;
      case "testimonials":
        return <TestimonialsSection key={module.id} testimonials={moduleData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        {modules.map((module: any) => renderModule(module))}
      </main>
      <Footer />
      
      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/5500000000000" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl shadow-green-500/40 hover:scale-110 transition-transform flex items-center justify-center"
      >
        <svg 
          viewBox="0 0 24 24" 
          width="24" 
          height="24" 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </a>
    </div>
  );
}
