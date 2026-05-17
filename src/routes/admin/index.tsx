import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { getStats } from "@/lib/cms-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ImageIcon, 
  Grid, 
  Package, 
  GraduationCap, 
  MousePointer2,
  Activity
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const fetchStats = useServerFn(getStats);
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => fetchStats(),
  });

  const cards = [
    { title: "Banners Ativos", value: stats?.banners || 0, icon: ImageIcon, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Categorias", value: stats?.categories || 0, icon: Grid, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Kits Pegue e Monte", value: stats?.kits || 0, icon: Package, color: "text-orange-600", bg: "bg-orange-100" },
    { title: "Cursos Ativos", value: stats?.courses || 0, icon: GraduationCap, color: "text-green-600", bg: "bg-green-100" },
    { title: "Módulos Ativos", value: stats?.modules || 0, icon: Activity, color: "text-red-600", bg: "bg-red-100" },
    { title: "Cliques WhatsApp", value: 0, icon: MousePointer2, color: "text-teal-600", bg: "bg-teal-100" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu sistema CMS</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`${card.bg} p-2 rounded-full`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
         <Card>
            <CardHeader>
              <CardTitle>Últimas Atividades</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground italic">Nenhuma atividade recente registrada.</p>
            </CardContent>
         </Card>
         <Card>
            <CardHeader>
              <CardTitle>Cliques por Unidade</CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-muted-foreground italic">Dados indisponíveis no momento.</p>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
