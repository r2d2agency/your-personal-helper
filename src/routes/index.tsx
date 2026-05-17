import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
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

const homeQueryOptions = () => {
  const fetchHome = useServerFn(getPublicHomeData);
  return queryOptions({
    queryKey: ["public-home"],
    queryFn: () => fetchHome(),
  });
};

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    // We can't use useServerFn in loader, so we need to handle it differently 
    // or just let useSuspenseQuery handle it on the client/SSR.
    // TanStack Start handles this.
  },
  component: Index,
});

function Index() {
  const { data: homeData } = useSuspenseQuery(homeQueryOptions());
  const { modules, data } = homeData;

  const renderModule = (module: any) => {
    switch (module.slug) {
      case "banners":
        return <BannerCarousel key={module.id} banners={data.banners} />;
      case "categories":
        return <CategoryGrid key={module.id} categories={data.categories} />;
      case "kits":
        return <FeaturedKits key={module.id} kits={data.kits} />;
      case "courses":
        return <CourseSection key={module.id} courses={data.courses} />;
      case "stores":
        return <StoreSection key={module.id} stores={data.stores} />;
      case "faq":
        return <FAQSection key={module.id} faqs={data.faq} />;
      case "testimonials":
        return <TestimonialsSection key={module.id} testimonials={data.testimonials} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {modules.map((module: any) => renderModule(module))}
      </main>
      <Footer />
    </div>
  );
}
