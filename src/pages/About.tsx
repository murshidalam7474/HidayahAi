import { Card } from "@/components/ui/card";
import { Github, Linkedin, Instagram, ExternalLink, Heart } from "lucide-react";

const About = () => {
  const socialLinks = [
    { icon: Github, href: "https://github.com/murshidalam7474", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/mohammed-murshid-alam-9421561ba/", label: "LinkedIn" },
    { icon: Instagram, href: "https://www.instagram.com/mma_7474/", label: "Instagram" },
    { icon: ExternalLink, href: "https://mma-portfolio-flame.vercel.app/", label: "Portfolio" },
  ];

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-10 relative z-10 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            About the Developer
          </h1>
        </div>

        <Card className="card-glass p-8 mb-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4">
              <span className="text-4xl">👨‍💻</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Mohammed Murshid Alam</h2>
            <p className="text-muted-foreground">Full Stack Developer</p>
          </div>

          <div className="space-y-4 mb-6">
            <p className="text-foreground/90 leading-relaxed">
              HidayahAI was created with the vision of making Islamic knowledge more accessible and engaging for everyone. This project combines modern technology with the timeless wisdom of Islam.
            </p>
            <p className="text-foreground/90 leading-relaxed">
              Built with love and dedication to serve the Muslim community worldwide, this app aims to be your companion in your spiritual journey.
            </p>
          </div>

          <div className="flex justify-center gap-4 pt-6 border-t border-border">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-full bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                aria-label={label}
              >
                <Icon className="w-5 h-5 text-foreground/70 transition-all duration-300 group-hover:text-purple-400 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              </a>
            ))}
          </div>
        </Card>

        <Card className="card-glass p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-accent fill-current animate-pulse" />
            <span>for the Ummah</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default About;
