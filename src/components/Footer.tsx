import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";

const Footer = () => {
  const quotes = [
    {
      text: "Indeed, with hardship comes ease.",
      reference: "Quran 94:6",
    },
    {
      text: "The best among you are those who have the best manners and character.",
      reference: "Sahih Bukhari",
    },
    {
      text: "Verily, Allah does not look at your appearance or wealth, but rather He looks at your hearts and actions.",
      reference: "Sahih Muslim",
    },
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <footer className="relative z-10 mt-20 border-t border-border/50">
      <div className="container mx-auto px-4 py-8">
        <Card className="card-glass p-6 mb-6">
          <p className="text-center text-foreground/90 italic mb-2">"{randomQuote.text}"</p>
          <p className="text-center text-sm text-muted-foreground">— {randomQuote.reference}</p>
        </Card>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>HidayahAI</span>
            <span>•</span>
            <span>v1.0.0</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-accent fill-current" />
            <span>for the Muslim community</span>
          </div>

          <div>
            <span>© 2026 All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
