import { Button } from "@/components/ui/button";
import { SectionWrapper } from "./SectionWrapper";
import { Calendar, MapPin, User } from "lucide-react";

interface Course {
  id: string;
  title: string;
  professor: string | null;
  event_date: string | null;
  location: string | null;
  image_cover: string | null;
  status: string | null;
}

export function CourseSection({ courses }: { courses: Course[] }) {
  if (courses.length === 0) return null;

  return (
    <SectionWrapper 
      title="Aprenda com quem entende do assunto" 
      subtitle="Cursos e Workshops"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex flex-col md:flex-row bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:border-primary/20 transition-all duration-300"
          >
            <div className="w-full md:w-48 h-48 md:h-auto overflow-hidden shrink-0">
              <img 
                src={course.image_cover || 'https://images.unsplash.com/photo-1544928147-7972ee46599e?auto=format&fit=crop&q=80&w=400'} 
                alt={course.title}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
              <div>
                {course.status === 'inscricoes_abertas' && (
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-green-500 text-white px-2 py-0.5 rounded-full mb-3 inline-block">
                    Inscrições Abertas
                  </span>
                )}
                <h3 className="text-2xl font-black mb-4 leading-tight">{course.title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span>{course.professor || "Especialista"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{course.event_date ? new Date(course.event_date).toLocaleDateString('pt-BR') : "Em breve"}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{course.location || "Auditório Basmar"}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="rounded-xl font-bold border-2">
                Mais Informações
              </Button>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
