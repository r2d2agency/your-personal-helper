import { Link } from "@tanstack/react-router";
import { SectionWrapper } from "./SectionWrapper";

interface Category {
  id: string;
  name: string;
  image_cover: string | null;
  description: string | null;
}

export function CategoryGrid({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <SectionWrapper 
      title="O que você está procurando?" 
      subtitle="Categorias"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((cat) => (
          <div key={cat.id}>
            <Link 
              to={`/categorias/${cat.id}`}
              className="group block text-center space-y-4"
            >
              <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-xl group-hover:shadow-primary/20 transition-all duration-300">
                <img 
                  src={cat.image_cover || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400'} 
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
            </Link>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
