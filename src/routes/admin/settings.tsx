import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { signUp, listAdmins } from "@/lib/auth.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { UserPlus, Mail, Lock, User, Shield } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();
  const fetchAdmins = useServerFn(listAdmins);
  const doSignUp = useServerFn(signUp);

  const { data: admins = [] } = useQuery({
    queryKey: ["admins"],
    queryFn: () => fetchAdmins(),
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await doSignUp({ data: { email, password, fullName, role: "admin" } });
      toast.success("Usuário criado com sucesso!");
      setEmail("");
      setPassword("");
      setFullName("");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie usuários e acessos administrativos.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Novo Administrador
            </CardTitle>
            <CardDescription>Crie uma nova conta de acesso ao painel.</CardDescription>
          </CardHeader>
          <form onSubmit={handleCreateUser}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="Ex: João Silva"
                    className="pl-10"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Criando..." : "Criar Usuário Admin"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Administradores Ativos
            </CardTitle>
            <CardDescription>Lista de usuários com acesso ao sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {admins.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">Nenhum administrador encontrado.</p>
              ) : (
                admins.map((admin: any) => (
                  <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {(admin.full_name || admin.email)?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">{admin.full_name || admin.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">{admin.email} · {admin.role}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
