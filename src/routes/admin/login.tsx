import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      throw redirect({
        to: "/admin",
      });
    }
  },
  component: AdminLogin,
});

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: 'admin', // Default role for new admin users
            }
          }
        });

        if (error) throw error;
        
        if (data?.user && !data.session) {
          toast.success("Cadastro realizado! Verifique seu email para confirmar a conta.");
        } else {
          toast.success("Conta criada e login realizado com sucesso!");
          navigate({ to: "/admin" });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success("Login realizado com sucesso!");
        navigate({ to: "/admin" });
      }
    } catch (error: any) {
      toast.error(error.message || `Erro ao ${isSignUp ? 'criar conta' : 'fazer login'}`);
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
              ? "Crie sua conta para começar a gerenciar o site" 
              : "Entre com suas credenciais para gerenciar o site"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading 
                ? (isSignUp ? "Criando conta..." : "Entrando...") 
                : (isSignUp ? "Criar conta" : "Entrar")}
            </Button>
            
            <div className="text-center text-sm mt-4">
              <button 
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline font-medium"
              >
                {isSignUp 
                  ? "Já tem uma conta? Entre aqui" 
                  : "Não tem uma conta? Crie uma agora"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
