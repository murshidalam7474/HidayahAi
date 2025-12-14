import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Heart, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Hadith {
  id: number;
  header: string;
  hadith_english: string;
  book: string;
  refno: string;
  bookName: string;
  chapterName: string;
  collection?: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const BOOK_SLUG_TO_COLLECTION: Record<string, string> = {
  "sahih-bukhari": "bukhari",
  "sahih-muslim": "muslim",
  "al-tirmidhi": "tirmidhi",
  "abu-dawood": "abudawud",
  "ibn-e-majah": "ibnmajah",
  "sunan-nasai": "nasai",
  "mishkat": "mishkat",
  "musnad-ahmad": "ahmad",
};

const CORS_PROXY = "https://corsproxy.io/?";

const HadithDetail = () => {
  const { bookSlug } = useParams<{ bookSlug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);

  const collection = bookSlug ? BOOK_SLUG_TO_COLLECTION[bookSlug] || bookSlug : "";

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteHadiths");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const fetchHadiths = useCallback(async (page: number, search?: string) => {
    if (!collection) return;
    
    setLoading(true);
    try {
      let url: string;
      if (search && search.trim()) {
        url = `${CORS_PROXY}${encodeURIComponent(`https://hadithapi.pages.dev/api/search?q=${search}&collection=${collection}&page=${page}&limit=10`)}`;
      } else {
        url = `${CORS_PROXY}${encodeURIComponent(`https://hadithapi.pages.dev/api/${collection}?page=${page}&limit=10`)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.results) {
        setHadiths(data.results);
        setPagination(data.pagination);
      } else if (Array.isArray(data)) {
        setHadiths(data);
        setPagination(null);
      } else {
        setHadiths([]);
        setPagination(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load hadiths. Please try again.",
        variant: "destructive",
      });
      setHadiths([]);
    } finally {
      setLoading(false);
    }
  }, [collection, toast]);

  useEffect(() => {
    fetchHadiths(currentPage, isSearching ? searchQuery : undefined);
  }, [currentPage, fetchHadiths, isSearching, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setIsSearching(searchQuery.trim().length > 0);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setCurrentPage(1);
  };

  const toggleFavorite = (hadithId: number) => {
    const newFavorites = favorites.includes(hadithId)
      ? favorites.filter((id) => id !== hadithId)
      : [...favorites, hadithId];
    
    setFavorites(newFavorites);
    localStorage.setItem("favoriteHadiths", JSON.stringify(newFavorites));
    
    toast({
      title: favorites.includes(hadithId) ? "Removed from favorites" : "Added to favorites",
      description: `Hadith ${hadithId} has been ${favorites.includes(hadithId) ? "removed from" : "added to"} your favorites.`,
    });
  };

  const getBookTitle = () => {
    const titles: Record<string, string> = {
      "sahih-bukhari": "Sahih Bukhari",
      "sahih-muslim": "Sahih Muslim",
      "al-tirmidhi": "Jami' Al-Tirmidhi",
      "abu-dawood": "Sunan Abu Dawood",
      "ibn-e-majah": "Sunan Ibn-e-Majah",
      "sunan-nasai": "Sunan An-Nasa'i",
      "mishkat": "Mishkat Al-Masabih",
      "musnad-ahmad": "Musnad Ahmad",
    };
    return titles[bookSlug || ""] || bookSlug;
  };

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-10 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/hadith")}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Books
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            {getBookTitle()}
          </h1>
          <p className="text-muted-foreground">
            {pagination ? `${pagination.total} Hadiths available` : "Browse and search hadiths"}
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search hadiths..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-primary/20 focus:border-primary"
              />
            </div>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Search
            </Button>
            {isSearching && (
              <Button type="button" variant="outline" onClick={clearSearch}>
                Clear
              </Button>
            )}
          </div>
        </form>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : hadiths.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No hadiths found.</p>
          </div>
        ) : (
          <>
            {/* Hadiths List */}
            <div className="space-y-6">
              {hadiths.map((hadith) => (
                <Card
                  key={hadith.id}
                  className="card-glass p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        {hadith.refno}
                      </span>
                      {hadith.bookName && (
                        <p className="text-sm text-muted-foreground">
                          {hadith.bookName} • {hadith.chapterName}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(hadith.id)}
                      className={favorites.includes(hadith.id) ? "text-red-500" : "text-muted-foreground"}
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(hadith.id) ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                  
                  {hadith.header && (
                    <p className="text-sm text-primary/80 italic mb-3">{hadith.header}</p>
                  )}
                  
                  <p className="text-foreground leading-relaxed">{hadith.hadith_english}</p>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrevPage}
                  className="border-primary/20"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <span className="text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={!pagination.hasNextPage}
                  className="border-primary/20"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HadithDetail;
