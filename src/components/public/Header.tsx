import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Menu, Phone, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/20">
            B
          </div>
          <span className="text-2xl font-black tracking-tight text-foreground">
            BASMAR
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/">Início</NavLink>
          <NavLink to="/categorias">Produtos</NavLink>
          <NavLink to="/kits">Pegue e Monte</NavLink>
          <NavLink to="/cursos">Cursos</NavLink>
          <NavLink to="/lojas">Lojas</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </Button>
          <Button className="hidden md:flex gap-2 rounded-full font-bold">
            <Phone className="w-4 h-4" />
            WhatsApp
          </Button>
          <Button variant="secondary" size="icon" className="rounded-full">
            <ShoppingBag className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Início</Link>
              <Link to="/categorias" onClick={() => setMobileMenuOpen(false)}>Produtos</Link>
              <Link to="/kits" onClick={() => setMobileMenuOpen(false)}>Pegue e Monte</Link>
              <Link to="/cursos" onClick={() => setMobileMenuOpen(false)}>Cursos</Link>
              <Link to="/lojas" onClick={() => setMobileMenuOpen(false)}>Lojas</Link>
              <Button className="w-full gap-2 font-bold">
                <Phone className="w-4 h-4" />
                WhatsApp
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link 
      to={to} 
      className="text-sm font-bold text-foreground/70 hover:text-primary transition-colors"
      activeProps={{ className: "text-primary" }}
    >
      {children}
    </Link>
  );
}
