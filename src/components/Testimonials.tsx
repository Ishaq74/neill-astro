import { Card, CardContent } from "./ui/card";
import { Star, Quote } from "lucide-react";

interface TestimonialsProps {
  testimonials: Array<{
    id: string;
    data: {
      name: string;
      role: string;
      imagePath: string;
      rating: number;
      text: string;
      service: string;
      sortOrder: number;
    };
  }>;
}

const Testimonials = ({ testimonials }: TestimonialsProps) => {
  // Transform the data from collections to match expected structure
  const testimonialsData = testimonials.map(testimonial => ({
    id: parseInt(testimonial.id.split('-')[testimonial.id.split('-').length - 1] === 'laurent' ? '1' : '2'), // Extract ID from slug
    name: testimonial.data.name,
    role: testimonial.data.role,
    image: testimonial.data.imagePath,
    rating: testimonial.data.rating,
    text: testimonial.data.text,
    service: testimonial.data.service
  }));

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-wide uppercase text-sm mb-4">
            Témoignages
          </p>
          <h2 className="font-elegant text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ce Que Disent
            <span className="block bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
              Mes Clientes
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Leurs mots touchent mon cœur et nourrissent ma passion. 
            Chaque sourire, chaque confiance retrouvée est ma plus belle récompense.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className="bg-gradient-to-br from-card to-muted border-border/50 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
            >
              <CardContent className="p-6 space-y-4">
                {/* Quote Icon */}
                <div className="flex justify-center">
                  <div className="p-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full text-white">
                    <Quote className="w-6 h-6" />
                  </div>
                </div>

                {/* Stars */}
                <div className="flex justify-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-center text-sm text-muted-foreground leading-relaxed italic">
                  "{testimonial.text}"
                </blockquote>

                {/* Service Badge */}
                <div className="flex justify-center">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {testimonial.service}
                  </span>
                </div>

                {/* Client Info */}
                <div className="text-center pt-4 border-t border-border/30">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white font-elegant font-semibold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h4 className="font-semibold text-foreground text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall Rating */}
        <div className="mt-16 text-center">
          <Card className="inline-block bg-gradient-to-br from-card to-muted border-border/50 luxury-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <div className="font-elegant text-3xl font-bold text-foreground">4.9/5</div>
                  <div className="flex justify-center space-x-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
                <div className="h-12 w-px bg-border/50"></div>
                <div className="text-center">
                  <div className="font-elegant text-3xl font-bold text-foreground">120+</div>
                  <div className="text-sm text-muted-foreground">Clientes satisfaites</div>
                </div>
                <div className="h-12 w-px bg-border/50"></div>
                <div className="text-center">
                  <div className="font-elegant text-3xl font-bold text-foreground">98%</div>
                  <div className="text-sm text-muted-foreground">Recommandent</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;