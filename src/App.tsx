import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Quran from "./pages/Quran";
import SurahDetail from "./pages/SurahDetail";
import Hadith from "./pages/Hadith";
import HadithDetail from "./pages/HadithDetail";
import Chat from "./pages/Chat";
import About from "./pages/About";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import StarryBackground from "./components/StarryBackground";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <StarryBackground />
        <div className="min-h-screen flex flex-col relative z-10">
          <Navigation />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quran" element={<Quran />} />
              <Route path="/quran/:surahNumber" element={<SurahDetail />} />
              <Route path="/hadith" element={<Hadith />} />
              <Route path="/hadith/:bookSlug" element={<HadithDetail />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
            <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
