import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { signIn, signUp, getMe } from "@/lib/auth.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  beforeLoad: async () => {
    try {
      const { user } = await getMe();
      if (user) throw redirect({ to: "/admin" });
    } catch (e) {
      if ((e as any)?.isRedirect) throw e;
    }
  },
  component: AdminLogin,
});

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const doSignIn = useServerFn(signIn);
  const doSignUp = useServerFn(signUp);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await doSignUp({ data: { email, password, fullName, role: "admin" } });
        toast.success("Conta criada com sucesso!");
      } else {
        await doSignIn({ data: { email, password } });
        toast.success("Login realizado!");
      }
      navigate({ to: "/admin", reloadDocument: true });
    } catch (error: any) {
      toast.error(error.message || `Erro ao ${isSignUp ? "criar conta" : "fazer login"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Basmar CMS</CardTitle>
          <CardDescription>
            {isSignUp
              ? "Crie sua conta para gerenciar o site"
              : "Entre com suas credenciais para gerenciar o site"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome completo</Label>
                <Input
                  id="fullName"
                  placeholder="Seu nome"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? isSignUp ? "Criando conta..." : "Entrando..."
                : isSignUp ? "Criar conta" : "Entrar"}
            </Button>

            <div className="text-center text-sm mt-4">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline font-medium"
              >
                {isSignUp ? "Já tem uma conta? Entre aqui" : "Não tem uma conta? Crie uma agora"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
