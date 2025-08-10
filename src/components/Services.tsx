import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Palette, GraduationCap, Crown, Sparkles } from "lucide-react";
import serviceImage1 from "@assets/service-makeup.jpg";
import serviceImage2 from "@assets/service-formation.jpg";

// Icon mapping for dynamic icons
const iconMap = {
  Palette: <Palette className="w-8 h-8" />,
  GraduationCap: <GraduationCap className="w-8 h-8" />,
  Crown: <Crown className="w-8 h-8" />,
  Sparkles: <Sparkles className="w-8 h-8" />
};

// Image mapping for now (since we store paths as strings but need to import)
const imageMap = {
  '/src/assets/service-makeup.jpg': serviceImage1,
  '/src/assets/service-formation.jpg': serviceImage2
};

interface ServicesProps {
  services: Array<{
    id: string;
    data: {
      title: string;
      description: string;
      iconName: string;
      imagePath: string;
      features: string[];
      price: string;
      sortOrder: number;
    };
  }>;
}

const Services = ({ services }: ServicesProps) => {
  // Transform the data from collections to match expected structure
  const servicesData = services.map(service => ({
    icon: iconMap[service.data.iconName as keyof typeof iconMap] || iconMap.Palette,
    title: service.data.title,
    description: service.data.description,
    image: imageMap[service.data.imagePath as keyof typeof imageMap] || serviceImage1,
    features: service.data.features,
    price: service.data.price
  }));

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-wide uppercase text-sm mb-4">
            Mes Services
          </p>
          <h2 className="font-elegant text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Mon Engagement
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chaque prestation est une œuvre d'art personnalisée. J'utilise exclusivement 
            des produits haut de gamme, hypoallergéniques et respectueux de votre 
            peau pour un résultat impeccable et durable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesData.map((service, index) => (
            <Card key={index} className="card-elegant group overflow-hidden">
              <CardContent className="p-0">
                {service.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image.src}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 img-dark-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                )}
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg text-white">
                      {service.icon}
                    </div>
                    <h3 className="font-elegant text-xl font-semibold text-foreground">
                      {service.title}
                    </h3>
                  </div>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-4 border-t border-border/50">
                    <p className="font-semibold text-primary mb-3">{service.price}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-primary text-primary hover:bg-gradient-to-r hover:from-amber-400 hover:to-yellow-500 hover:text-white hover:border-transparent elegant-shadow transition-all duration-300"
                      onClick={() => {
                        // Navigate to individual service page
                        const slug = services[index]?.id || `service-${index + 1}`;
                        window.location.href = `/services/${slug}`;
                      }}
                    >
                      En savoir plus
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;