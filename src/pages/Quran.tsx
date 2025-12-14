import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Bookmark, Heart, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

const Quran = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [favoriteSurahs, setFavoriteSurahs] = useState<number[]>([]);
  const [favoriteAyahs, setFavoriteAyahs] = useState<{surah: number, ayah: number, text: string}[]>([]);
  const [completedSurahs, setCompletedSurahs] = useState<number[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const goToLastRead = () => {
    const lastReadSurah = localStorage.getItem('globalLastReadSurah');
    const lastReadAyah = localStorage.getItem('globalLastReadAyah');
    
    if (lastReadSurah && lastReadAyah) {
      navigate(`/quran/${lastReadSurah}`);
      toast({
        title: "Jumping to last read",
        description: `Surah ${lastReadSurah}, Ayah ${lastReadAyah}`,
      });
    } else {
      toast({
        title: "No last read found",
        description: "Start reading to mark your progress",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSurahs();
    loadFavorites();
    loadCompletedSurahs();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = surahs.filter(
        (surah) =>
          surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          surah.number.toString().includes(searchTerm) ||
          surah.englishNameTranslation.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSurahs(filtered);
    } else {
      setFilteredSurahs(surahs);
    }
  }, [searchTerm, surahs]);

  const loadFavorites = () => {
    const savedFavoriteSurahs = localStorage.getItem('favoriteSurahs');
    if (savedFavoriteSurahs) {
      setFavoriteSurahs(JSON.parse(savedFavoriteSurahs));
    }
    
    const savedFavoriteAyahs = localStorage.getItem('favoriteAyahs');
    if (savedFavoriteAyahs) {
      setFavoriteAyahs(JSON.parse(savedFavoriteAyahs));
    }
  };

  const loadCompletedSurahs = () => {
    const saved = localStorage.getItem('completedSurahs');
    if (saved) {
      setCompletedSurahs(JSON.parse(saved));
    }
  };

  const toggleFavoriteSurah = (surahNumber: number) => {
    const newFavorites = favoriteSurahs.includes(surahNumber)
      ? favoriteSurahs.filter(n => n !== surahNumber)
      : [...favoriteSurahs, surahNumber];
    setFavoriteSurahs(newFavorites);
    localStorage.setItem('favoriteSurahs', JSON.stringify(newFavorites));
    toast({
      title: favoriteSurahs.includes(surahNumber) ? "Removed from favorites" : "Added to favorites",
      description: `Surah ${surahNumber}`,
    });
  };

  const getQuranProgress = () => {
    return (completedSurahs.length / 114) * 100;
  };

  const fetchSurahs = async () => {
    try {
      const response = await fetch("https://api.alquran.cloud/v1/surah");
      const data = await response.json();
      setSurahs(data.data);
      setFilteredSurahs(data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load Surahs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Holy Quran
          </h1>
          <p className="text-muted-foreground mb-6">
            Read and listen to the complete Quran with translations
          </p>

          {/* Progress Tracking */}
          <Card className="card-glass p-4 mb-6 max-w-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Quran Progress</span>
              <span className="text-sm text-muted-foreground">{completedSurahs.length}/114 Surahs</span>
            </div>
            <Progress value={getQuranProgress()} className="h-2" />
          </Card>

          {/* Search and Actions */}
          <div className="flex flex-wrap gap-3 items-center max-w-2xl">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <Button
              onClick={goToLastRead}
              variant="outline"
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Bookmark className="w-4 h-4" />
              Last Read
            </Button>
            
            {/* Favorite Surahs Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
                  <Star className="w-4 h-4" />
                  Favorite Surahs
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Favorite Surahs</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  {favoriteSurahs.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No favorite surahs yet</p>
                  ) : (
                    favoriteSurahs.map(surahNum => {
                      const surah = surahs.find(s => s.number === surahNum);
                      return surah ? (
                        <Link key={surah.number} to={`/quran/${surah.number}`}>
                          <Card className="card-glass p-4 hover:scale-105 transition-all cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-xl font-bold">{surah.englishName}</h3>
                                <p className="text-sm text-muted-foreground">{surah.englishNameTranslation}</p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.preventDefault();
                                  toggleFavoriteSurah(surah.number);
                                }}
                              >
                                <Heart className="w-4 h-4 fill-current text-accent" />
                              </Button>
                            </div>
                          </Card>
                        </Link>
                      ) : null;
                    })
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Favorite Ayahs Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
                  <Heart className="w-4 h-4" />
                  Favorite Ayahs
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Favorite Ayahs</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {favoriteAyahs.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No favorite ayahs yet</p>
                  ) : (
                    favoriteAyahs.map((fav, idx) => (
                      <Card key={idx} className="card-glass p-4 cursor-pointer" onClick={() => navigate(`/quran/${fav.surah}`)}>
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm font-semibold text-accent">Surah {fav.surah}, Ayah {fav.ayah}</span>
                        </div>
                        <p className="text-right font-arabic text-xl leading-loose" dir="rtl">{fav.text}</p>
                      </Card>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSurahs.map((surah) => {
              const isFavorite = favoriteSurahs.includes(surah.number);
              const isCompleted = completedSurahs.includes(surah.number);
              
              return (
                <div key={surah.number} className="relative">
                  <Link to={`/quran/${surah.number}`}>
                    <Card className={`card-glass p-6 hover:scale-105 transition-all duration-300 cursor-pointer group ${isCompleted ? 'border-2 border-primary' : ''}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                          <span className="text-white font-bold">{surah.number}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {surah.revelationType}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavoriteSurah(surah.number);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-accent' : ''}`} />
                          </Button>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-1 text-right" dir="rtl">
                        {surah.name}
                      </h3>
                      <h4 className="text-lg font-semibold mb-1">{surah.englishName}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {surah.englishNameTranslation}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {surah.numberOfAyahs} Ayahs
                        </p>
                        {isCompleted && (
                          <span className="text-xs text-primary font-semibold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> Completed
                          </span>
                        )}
                      </div>
                    </Card>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quran;
