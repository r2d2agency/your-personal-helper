import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { getModules } from "@/lib/cms-queries";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Search,
  ArrowUp,
  ArrowDown,
  Pencil,
  Home,
  Menu as MenuIcon,
} from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/admin/modules")({
  component: ModulesManager,
});

const iconMap: Record<string, any> = {
  Image: ImageIcon,
  Grid,
  Package,
  GraduationCap,
  MapPin,
  HelpCircle,
  MessageSquare,
};

const iconOptions = Object.keys(iconMap);

type CmsModule = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  is_active: boolean | null;
  display_in_menu: boolean | null;
  display_in_home: boolean | null;
  menu_order: number | null;
};

function ModulesManager() {
  const fetchModules = useServerFn(getModules);
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<CmsModule | null>(null);

  const { data: modulesRaw, isLoading } = useQuery({
    queryKey: ["admin-modules"],
    queryFn: () => fetchModules(),
  });

  const modules = useMemo(
    () =>
      [...(modulesRaw ?? [])].sort(
        (a, b) => (a.menu_order ?? 0) - (b.menu_order ?? 0),
      ) as CmsModule[],
    [modulesRaw],
  );

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-modules"] });

  const updateModule = useMutation({
    mutationFn: async (patch: Partial<CmsModule> & { id: number }) => {
      const { id, ...rest } = patch;
      const { error } = await supabase
        .from("cms_modules")
        .update(rest)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Módulo atualizado");
    },
    onError: (err: any) => toast.error("Erro: " + err.message),
  });

  const swapOrder = async (a: CmsModule, b: CmsModule) => {
    const aOrder = a.menu_order ?? 0;
    const bOrder = b.menu_order ?? 0;
    await Promise.all([
      supabase.from("cms_modules").update({ menu_order: bOrder }).eq("id", a.id),
      supabase.from("cms_modules").update({ menu_order: aOrder }).eq("id", b.id),
    ]);
    invalidate();
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = modules[index + dir];
    if (!target) return;
    swapOrder(modules[index], target);
  };

  const filtered = modules.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.slug.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gerenciador de Módulos
          </h1>
          <p className="text-muted-foreground">
            Ative, reordene e configure os módulos do CMS
          </p>
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

      <Card>
        <CardHeader>
          <CardTitle>Módulos cadastrados</CardTitle>
          <CardDescription>
            Use as setas para reordenar. As alterações refletem no menu admin e na home.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-2">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-lg bg-muted animate-pulse"
                  />
                ))}
            </div>
          ) : (
            <ul className="divide-y">
              {filtered.map((m, i) => {
                const Icon = iconMap[m.icon || "Grid"] || Grid;
                return (
                  <li
                    key={m.id}
                    className={`flex items-center gap-4 p-4 ${
                      !m.is_active ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex flex-col">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={i === 0}
                        onClick={() => move(i, -1)}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={i === filtered.length - 1}
                        onClick={() => move(i, 1)}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{m.name}</span>
                        <code className="text-xs px-1.5 py-0.5 rounded bg-muted">
                          {m.slug}
                        </code>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {m.description || "Sem descrição"}
                      </p>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                      {m.display_in_menu && (
                        <Badge variant="outline" className="gap-1">
                          <MenuIcon className="h-3 w-3" /> Menu
                        </Badge>
                      )}
                      {m.display_in_home && (
                        <Badge variant="secondary" className="gap-1">
                          <Home className="h-3 w-3" /> Home
                        </Badge>
                      )}
                    </div>
                    <Switch
                      checked={!!m.is_active}
                      onCheckedChange={(v) =>
                        updateModule.mutate({ id: m.id, is_active: v })
                      }
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditing(m)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </li>
                );
              })}
              {filtered.length === 0 && (
                <li className="p-8 text-center text-sm text-muted-foreground">
                  Nenhum módulo encontrado
                </li>
              )}
            </ul>
          )}
        </CardContent>
      </Card>

      <EditModuleDialog
        module={editing}
        onClose={() => setEditing(null)}
        onSave={(patch) => {
          updateModule.mutate(patch, {
            onSuccess: () => setEditing(null),
          });
        }}
      />
    </div>
  );
}

function EditModuleDialog({
  module: mod,
  onClose,
  onSave,
}: {
  module: CmsModule | null;
  onClose: () => void;
  onSave: (patch: Partial<CmsModule> & { id: number }) => void;
}) {
  const [form, setForm] = useState<Partial<CmsModule>>({});

  // sync when opening
  const open = !!mod;
  useMemo(() => {
    if (mod) setForm(mod);
  }, [mod]);

  if (!mod) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar módulo</DialogTitle>
          <DialogDescription>
            Configure metadados, ícone e visibilidade.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Nome</Label>
              <Input
                value={form.name ?? ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input
                value={form.slug ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "-"),
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Descrição</Label>
            <Textarea
              rows={3}
              value={form.description ?? ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Ícone</Label>
              <Select
                value={form.icon ?? "Grid"}
                onValueChange={(v) => setForm({ ...form, icon: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((name) => {
                    const I = iconMap[name];
                    return (
                      <SelectItem key={name} value={name}>
                        <span className="flex items-center gap-2">
                          <I className="h-4 w-4" />
                          {name}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Ordem no menu</Label>
              <Input
                type="number"
                value={form.menu_order ?? 0}
                onChange={(e) =>
                  setForm({ ...form, menu_order: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="space-y-3 rounded-lg border p-3">
            <ToggleRow
              label="Ativo"
              hint="Disponibiliza o módulo no sistema"
              checked={!!form.is_active}
              onChange={(v) => setForm({ ...form, is_active: v })}
            />
            <ToggleRow
              label="Exibir no menu admin"
              hint="Mostra link na barra lateral"
              checked={!!form.display_in_menu}
              onChange={(v) => setForm({ ...form, display_in_menu: v })}
            />
            <ToggleRow
              label="Exibir na home pública"
              hint="Renderiza a seção na página inicial"
              checked={!!form.display_in_home}
              onChange={(v) => setForm({ ...form, display_in_home: v })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={() =>
              onSave({
                id: mod.id,
                name: form.name,
                slug: form.slug,
                description: form.description,
                icon: form.icon,
                menu_order: form.menu_order,
                is_active: form.is_active,
                display_in_menu: form.display_in_menu,
                display_in_home: form.display_in_home,
              })
            }
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
