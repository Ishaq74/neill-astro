import { Button } from "./ui/button";
import { Star } from "lucide-react";
import heroImage from "@assets/hero-beauty.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <p className="text-primary font-medium tracking-wide uppercase text-xs sm:text-sm">
                L'artisane de votre beauté
              </p>
              <h1 className="font-elegant hero-responsive font-bold text-foreground leading-tight">
                Une Approche
                <span className="block bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                  Unique
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
                Passionnée par l'art du maquillage et la transmission, je vous accompagne avec 
                bienveillance pour révéler votre beauté naturelle et développer votre confiance.
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-muted-foreground">4.9/5 • 120+ clientes satisfaites</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                size="lg" 
                className="btn-gradient hover-glow luxury-shadow text-sm sm:text-base font-medium"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Découvrir mes services
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary text-primary hover:bg-gradient-to-r hover:from-amber-400 hover:to-yellow-500 hover:text-white hover:border-transparent elegant-shadow text-sm sm:text-base font-medium transition-all duration-300"
                onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Voir la galerie
              </Button>
            </div>

            {/* Decorative Line */}
            <div className="flex items-center space-x-4 pt-8">
              <div className="h-px bg-gradient-to-r from-amber-400 to-yellow-500 w-16"></div>
              <Star className="w-4 h-4 text-primary" />
              <div className="h-px bg-gradient-to-r from-yellow-500 to-amber-400 w-16"></div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl luxury-shadow hover:scale-105 transition-transform duration-300">
              <img
                src={heroImage.src}
                alt="Neill Beauty - Maquillage professionnel"
                className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-white/90 backdrop-blur-md rounded-full p-4 sm:p-6 elegant-shadow animate-bounce">
              <div className="text-center">
                <p className="font-elegant text-xl sm:text-2xl font-bold text-primary">15+</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Années d'expérience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;