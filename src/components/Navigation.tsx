import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Book, MessageSquare, User, Home } from "lucide-react";
import logo from "@/assets/logo.png";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/quran", label: "Quran", icon: BookOpen },
    { href: "/hadith", label: "Hadith", icon: Book },
    { href: "/chat", label: "AI Chat", icon: MessageSquare },
    { href: "/about", label: "About", icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-indigo-500/20 backdrop-blur-xl bg-[#0a0a1a]/80">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="HidayahAI Logo" className="w-10 h-10 rounded-lg object-cover" />
            <span className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              HidayahAI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={isActive ? "bg-emerald-500 hover:bg-emerald-600" : "hover:bg-white/10"}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={isActive ? "text-emerald-400" : "hover:bg-white/10"}
                  >
                    <Icon className="w-5 h-5" />
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
