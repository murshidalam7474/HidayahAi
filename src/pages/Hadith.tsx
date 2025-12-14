import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HadithBook {
  id: number;
  bookName: string;
  writerName: string;
  hadiths_count: string;
  bookSlug: string;
}

const Hadith = () => {
  const [books, setBooks] = useState<HadithBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        "https://hadithapi.com/api/books?apiKey=$2y$10$3xHbaC6zDjkLeIMItRVehA5O9dRIK1z9CoOfNHMr5Z1hwjBGYK"
      );
      const data = await response.json();
      setBooks(data.books || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load Hadith books. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter((book) =>
    book.bookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.writerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookClick = (bookSlug: string) => {
    navigate(`/hadith/${bookSlug}`);
  };

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Hadith Collections
          </h1>
          <p className="text-muted-foreground">
            Explore authentic collections of Hadith from renowned scholars
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 border-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card
                key={book.id}
                onClick={() => handleBookClick(book.bookSlug)}
                className="card-glass p-6 hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{book.bookName}</h3>
                <p className="text-sm text-muted-foreground mb-3">by {book.writerName}</p>
                <p className="text-xs text-muted-foreground">
                  {book.hadiths_count} Hadiths
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hadith;
