import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, Heart, Bookmark, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  audio?: string;
}

interface Translation {
  number: number;
  text: string;
}

interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

interface Reciter {
  identifier: string;
  name: string;
  englishName: string;
}

const SurahDetail = () => {
  const { surahNumber } = useParams();
  const [surahData, setSurahData] = useState<SurahData | null>(null);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [currentAudio, setCurrentAudio] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [lastRead, setLastRead] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [globalFavoriteAyahs, setGlobalFavoriteAyahs] = useState<{surah: number, ayah: number, text: string}[]>([]);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [selectedReciter, setSelectedReciter] = useState(() => {
    return localStorage.getItem('preferredReciter') || "ar.alafasy";
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchReciters();
  }, []);

  // Save reciter preference whenever it changes
  useEffect(() => {
    localStorage.setItem('preferredReciter', selectedReciter);
  }, [selectedReciter]);

  useEffect(() => {
    if (surahNumber) {
      fetchSurahData(parseInt(surahNumber), selectedReciter);
      loadUserData();
    }
  }, [surahNumber, selectedReciter]);

  useEffect(() => {
    const savedLastRead = localStorage.getItem(`lastRead_${surahNumber}`);
    if (savedLastRead && surahData) {
      const ayahNumber = parseInt(savedLastRead);
      setTimeout(() => {
        const element = document.getElementById(`ayah-${ayahNumber}`);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    }
  }, [surahData]);

  const loadUserData = () => {
    const savedFavorites = localStorage.getItem(`favorites_${surahNumber}`);
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    const savedLastRead = localStorage.getItem(`lastRead_${surahNumber}`);
    if (savedLastRead) {
      setLastRead(parseInt(savedLastRead));
    }
    const savedGlobalFavorites = localStorage.getItem('favoriteAyahs');
    if (savedGlobalFavorites) {
      setGlobalFavoriteAyahs(JSON.parse(savedGlobalFavorites));
    }
  };

  const fetchReciters = async () => {
    try {
      const res = await fetch("https://api.alquran.cloud/v1/edition/format/audio");
      const data = await res.json();
      // Filter to only Arabic reciters
      const arabicReciters = data.data.filter((r: Reciter) => r.identifier.startsWith("ar."));
      setReciters(arabicReciters);
    } catch (error) {
      console.error("Failed to fetch reciters:", error);
    }
  };

  const fetchSurahData = async (number: number, reciterId: string) => {
    setLoading(true);
    try {
      const [arabicRes, translationRes, audioRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${number}`),
        fetch(`https://api.alquran.cloud/v1/surah/${number}/en.asad`),
        fetch(`https://api.alquran.cloud/v1/surah/${number}/${reciterId}`),
      ]);

      const arabicData = await arabicRes.json();
      const translationData = await translationRes.json();
      const audioData = await audioRes.json();

      const combinedAyahs = arabicData.data.ayahs.map((ayah: Ayah, index: number) => ({
        ...ayah,
        audio: audioData.data.ayahs[index]?.audio,
      }));

      setSurahData({ ...arabicData.data, ayahs: combinedAyahs });
      setTranslations(translationData.data.ayahs);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load Surah. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (ayahNumber: number, audioUrl: string) => {
    if (currentAudio === ayahNumber) {
      audioRef.current?.pause();
      setCurrentAudio(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setCurrentAudio(ayahNumber);
        setLastRead(ayahNumber);
        localStorage.setItem(`lastRead_${surahNumber}`, ayahNumber.toString());
        localStorage.setItem('globalLastReadSurah', surahNumber?.toString() || '');
        localStorage.setItem('globalLastReadAyah', ayahNumber.toString());
      }
    }
  };

  const playNextAyah = () => {
    if (!surahData || currentAudio === null) return;
    
    const currentIndex = surahData.ayahs.findIndex(
      (ayah) => ayah.numberInSurah === currentAudio
    );
    
    if (currentIndex < surahData.ayahs.length - 1) {
      const nextAyah = surahData.ayahs[currentIndex + 1];
      if (nextAyah.audio) {
        playAudio(nextAyah.numberInSurah, nextAyah.audio);
      }
    } else {
      setCurrentAudio(null);
    }
  };

  const toggleFavorite = (ayahNumber: number, ayahText: string) => {
    const newFavorites = favorites.includes(ayahNumber)
      ? favorites.filter((n) => n !== ayahNumber)
      : [...favorites, ayahNumber];
    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${surahNumber}`, JSON.stringify(newFavorites));
    
    // Update global favorites
    const existingIndex = globalFavoriteAyahs.findIndex(
      f => f.surah === parseInt(surahNumber || '0') && f.ayah === ayahNumber
    );
    
    let newGlobalFavorites;
    if (existingIndex > -1) {
      newGlobalFavorites = globalFavoriteAyahs.filter((_, idx) => idx !== existingIndex);
    } else {
      newGlobalFavorites = [...globalFavoriteAyahs, {
        surah: parseInt(surahNumber || '0'),
        ayah: ayahNumber,
        text: ayahText
      }];
    }
    setGlobalFavoriteAyahs(newGlobalFavorites);
    localStorage.setItem('favoriteAyahs', JSON.stringify(newGlobalFavorites));
    
    toast({
      title: favorites.includes(ayahNumber) ? "Removed from favorites" : "Added to favorites",
      description: `Ayah ${ayahNumber}`,
    });
  };

  const checkSurahCompletion = () => {
    if (!surahData) return;
    
    const lastReadAyah = lastRead || 0;
    if (lastReadAyah === surahData.numberOfAyahs) {
      const completedSurahs = JSON.parse(localStorage.getItem('completedSurahs') || '[]');
      if (!completedSurahs.includes(surahData.number)) {
        completedSurahs.push(surahData.number);
        localStorage.setItem('completedSurahs', JSON.stringify(completedSurahs));
        toast({
          title: "🎉 Surah Completed!",
          description: `Congratulations! You've completed Surah ${surahData.englishName}`,
        });
      }
    }
  };

  useEffect(() => {
    checkSurahCompletion();
  }, [lastRead, surahData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!surahData) return null;

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-10 relative z-10 max-w-4xl">
        <Link to="/quran">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Surahs
          </Button>
        </Link>

        {/* Surah Header */}
        <Card className="card-glass p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-right" dir="rtl">
            {surahData.name}
          </h1>
          <h2 className="text-2xl font-semibold mb-2">{surahData.englishName}</h2>
          <p className="text-muted-foreground mb-4">{surahData.englishNameTranslation}</p>
          <p className="text-sm text-muted-foreground mb-4">{surahData.numberOfAyahs} Ayahs</p>
          
          {/* Reciter Selector */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Reciter:</span>
            <Select value={selectedReciter} onValueChange={setSelectedReciter}>
              <SelectTrigger className="w-[200px] bg-background/50 border-indigo-500/30">
                <SelectValue placeholder="Select reciter" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {reciters.map((reciter) => (
                  <SelectItem key={reciter.identifier} value={reciter.identifier}>
                    {reciter.englishName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Ayahs */}
        <div className="space-y-6">
          {surahData.ayahs.map((ayah, index) => {
            const translation = translations[index];
            const isPlaying = currentAudio === ayah.numberInSurah;
            const isFavorite = favorites.includes(ayah.numberInSurah);
            const isLastRead = lastRead === ayah.numberInSurah;
            const isPlayingFavorite = isPlaying && isFavorite;

            return (
              <Card
                key={ayah.number}
                id={`ayah-${ayah.numberInSurah}`}
                className={`card-glass p-6 ${
                  isPlayingFavorite ? "playing-favorite-ayah" : isPlaying ? "playing-ayah" : ""
                } ${isLastRead ? "border-2 border-accent" : ""}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{ayah.numberInSurah}</span>
                    </div>
                    {isLastRead && (
                      <div className="flex items-center gap-1 text-xs text-accent">
                        <Bookmark className="w-3 h-3 fill-current" />
                        Last Read
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFavorite(ayah.numberInSurah, ayah.text)}
                      className={isFavorite ? "text-accent" : ""}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                    </Button>
                    {ayah.audio && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => playAudio(ayah.numberInSurah, ayah.audio!)}
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-3xl leading-loose mb-4 text-right font-arabic" dir="rtl">
                  {ayah.text}
                </p>

                {translation && (
                  <p className="text-base text-muted-foreground leading-relaxed border-t border-border pt-4">
                    {translation.text}
                  </p>
                )}
              </Card>
            );
          })}
        </div>

        <audio
          ref={audioRef}
          onEnded={playNextAyah}
          onError={() => {
            toast({
              title: "Audio Error",
              description: "Failed to play audio",
              variant: "destructive",
            });
            setCurrentAudio(null);
          }}
        />
      </div>
    </div>
  );
};

export default SurahDetail;
