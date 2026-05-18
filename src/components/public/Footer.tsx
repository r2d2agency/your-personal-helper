import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";
import basmarLogo from "@/assets/logo-basmar.png";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center rounded-md bg-white px-3 py-2">
              <img
                src={basmarLogo}
                alt="Basmar Doces e Artigos de Festas"
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Tudo o que você precisa para tornar suas festas e eventos inesquecíveis. Desde descartáveis a kits completos de decoração.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={Instagram} />
              <SocialIcon icon={Facebook} />
              <SocialIcon icon={Youtube} />
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">Links Rápidos</h4>
            <ul className="space-y-4 text-white/60 text-sm">
              <li><FooterLink to="/sobre">Nossa História</FooterLink></li>
              <li><FooterLink to="/categorias">Categorias</FooterLink></li>
              <li><FooterLink to="/kits">Pegue e Monte</FooterLink></li>
              <li><FooterLink to="/cursos">Cursos e Workshops</FooterLink></li>
              <li><FooterLink to="/lojas">Nossas Lojas</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">Categorias Populares</h4>
            <ul className="space-y-4 text-white/60 text-sm">
              <li><FooterLink to="/categorias/descartaveis">Descartáveis</FooterLink></li>
              <li><FooterLink to="/categorias/confeitaria">Confeitaria</FooterLink></li>
              <li><FooterLink to="/categorias/decoracao">Decoração</FooterLink></li>
              <li><FooterLink to="/categorias/embalagens">Embalagens</FooterLink></li>
              <li><FooterLink to="/categorias/baloes">Balões</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">Contato</h4>
            <ul className="space-y-4 text-white/60 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-white shrink-0" />
                <span>Confira o endereço das nossas lojas físicas.</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-white shrink-0" />
                <span>(00) 0000-0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-white shrink-0" />
                <span>contato@basmar.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-white/40 text-xs">
          <p>© {new Date().getFullYear()} Basmar. Todos os direitos reservados. Desenvolvido com carinho para suas festas.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon: Icon }: { icon: any }) {
  return (
    <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
      <Icon className="w-5 h-5" />
    </a>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="hover:text-primary transition-colors">
      {children}
    </Link>
  );
}
