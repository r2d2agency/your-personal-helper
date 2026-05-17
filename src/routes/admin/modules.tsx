import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { getModules } from "@/lib/cms-queries";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Image as ImageIcon, 
  Grid, 
  Package, 
  GraduationCap, 
  MapPin, 
  HelpCircle, 
  MessageSquare,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Route = createFileRoute("/admin/modules")({
  component: ModulesManager,
});

const iconMap: Record<string, any> = {
  Image: ImageIcon,
  Grid: Grid,
  Package: Package,
  GraduationCap: GraduationCap,
  MapPin: MapPin,
  HelpCircle: HelpCircle,
  MessageSquare: MessageSquare,
};

function ModulesManager() {
  const fetchModules = useServerFn(getModules);
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: modules, isLoading } = useQuery({
    queryKey: ['admin-modules'],
    queryFn: () => fetchModules(),
  });

  const toggleModule = useMutation({
    mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) => {
      const { error } = await supabase
        .from("cms_modules")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-modules'] });
      toast.success("Módulo atualizado com sucesso");
    },
    onError: (err: any) => {
      toast.error("Erro ao atualizar módulo: " + err.message);
    }
  });

  const filteredModules = modules?.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciador de Módulos</h1>
          <p className="text-muted-foreground">Ative ou desative funcionalidades do sistema</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar módulo..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-gray-100 animate-pulse" />
          ))
        ) : (
          filteredModules?.map((module) => {
            const Icon = iconMap[module.icon || "Grid"] || Grid;
            return (
              <Card key={module.id} className={module.is_active ? "" : "opacity-60 grayscale"}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                      <CardDescription className="text-xs">{module.slug}</CardDescription>
                    </div>
                  </div>
                  <Switch 
                    checked={module.is_active} 
                    onCheckedChange={(checked) => toggleModule.mutate({ id: module.id, is_active: checked })}
                  />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {module.display_in_menu && <Badge variant="outline">Menu Admin</Badge>}
                    {module.display_in_home && <Badge variant="secondary">Home Page</Badge>}
                    <Badge variant={module.is_active ? "default" : "destructive"}>
                      {module.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {module.description || "Nenhuma descrição fornecida para este módulo."}
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
