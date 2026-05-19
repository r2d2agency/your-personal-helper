import { createFileRoute, Outlet, redirect, Link, useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutDashboard, 
  Settings, 
  Image as ImageIcon, 
  Grid, 
  Package, 
  GraduationCap, 
  MapPin, 
  LogOut,
  ChevronRight,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    // Evita loop se já estiver na página de login
    if (location.pathname === "/admin/login") {
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw redirect({
        to: "/admin/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AdminLayout,
});

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, to: "/admin" },
  { title: "Módulos", icon: Grid, to: "/admin/modules" },
  { title: "Banners", icon: ImageIcon, to: "/admin/banners" },
  { title: "Categorias", icon: Grid, to: "/admin/categories" },
  { title: "Pegue e Monte", icon: Package, to: "/admin/kits" },
  { title: "Cursos", icon: GraduationCap, to: "/admin/courses" },
  { title: "Lojas", icon: MapPin, to: "/admin/stores" },
  { title: "Configurações", icon: Settings, to: "/admin/settings" },
];

function AdminLayout() {
  const location = useLocation();

  // Renderiza apenas o Outlet (sem sidebar) na tela de login
  if (location.pathname === "/admin/login") {
    return <Outlet />;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado");
    window.location.href = "/admin/login";
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50/50">
        <Sidebar className="border-r bg-white">
          <SidebarHeader className="border-b p-4">
            <Link to="/admin" className="flex items-center gap-2 font-bold text-xl text-primary">
              <span className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center">B</span>
              Basmar Admin
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <Link to={item.to} activeProps={{ className: "bg-primary/10 text-primary font-medium" }}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <Button variant="ghost" className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 border-b bg-white flex items-center px-4 justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="h-4 w-px bg-gray-200" />
              <nav className="flex items-center text-sm text-gray-500">
                <span>Admin</span>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span className="text-gray-900 font-medium">Dashboard</span>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/" className="text-sm text-primary hover:underline" target="_blank">
                Ver Site
              </Link>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
