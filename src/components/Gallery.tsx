import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { X, ZoomIn } from "lucide-react";

interface GalleryItem {
  id: string;
  data: {
    title: string;
    description: string;
    category: string;
    serviceId?: number;
    images: string[];
    featuredImage: string;
    isFeatured: boolean;
    sortOrder: number;
  };
}

interface GalleryProps {
  gallery: GalleryItem[];
}

const Gallery = ({ gallery }: GalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Get all unique categories from gallery data
  const categories = ["Tous", ...Array.from(new Set(gallery.map(item => item.data.category)))];
  const [activeCategory, setActiveCategory] = useState("Tous");

  const filteredItems = activeCategory === "Tous" 
    ? gallery 
    : gallery.filter(item => item.data.category === activeCategory);

  return (
    <section id="gallery" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-wide uppercase text-sm mb-4">
            Portfolio
          </p>
          <h2 className="font-elegant text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Mes Créations
            <span className="block bg-gradient-luxury bg-clip-text text-transparent">
              Artistiques
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez une sélection de mes réalisations. Chaque création raconte 
            une histoire unique et reflète la personnalité de mes clientes.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className={`
                ${activeCategory === category 
                  ? "bg-gradient-luxury text-white" 
                  : "border-primary text-primary hover:bg-primary hover:text-white"
                }
                transition-all duration-300
              `}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className="group overflow-hidden bg-gradient-card border-border/50 hover-glow cursor-pointer animate-fade-in"
            >
              <CardContent className="p-0">
                <a href={`/gallery/${item.id}`} className="block">
                  <div className="relative overflow-hidden">
                    <img
                      src={`/src/assets/${item.data.featuredImage}`}
                      alt={item.data.title}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <span className="inline-block px-3 py-1 bg-primary/80 rounded-full text-xs font-medium mb-2">
                          {item.data.category}
                        </span>
                        <h3 className="font-elegant text-xl font-semibold mb-2">
                          {item.data.title}
                        </h3>
                        <p className="text-sm text-white/90 line-clamp-2">
                          {item.data.description}
                        </p>
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                          <ZoomIn className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
                
                {/* Quick view button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <button
                    className="pointer-events-auto px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-900 font-medium hover:bg-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedImage(`/src/assets/${item.data.featuredImage}`);
                    }}
                  >
                    Aperçu rapide
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
            <div className="relative max-w-4xl max-h-full">
              <img
                src={selectedImage}
                alt="Portfolio en grand"
                className="w-full h-full object-contain rounded-lg animate-scale-in"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;