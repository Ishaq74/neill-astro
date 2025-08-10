import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Users, Award, BookOpen, CheckCircle, ArrowRight } from "lucide-react";

interface FormationsProps {
  formations: Array<{
    id: string;
    data: {
      title: string;
      subtitle: string;
      description: string;
      level: string;
      duration: string;
      participants: string;
      price: string;
      features: string[];
      imagePath?: string;
      badge: string;
      sortOrder: number;
    };
  }>;
}

const Formations = ({ formations }: FormationsProps) => {
  // Transform the data from collections to match expected structure
  const formationsData = formations?.length > 0 ? formations.map(formation => ({
    id: formation.data.sortOrder,
    title: formation.data.title,
    subtitle: formation.data.subtitle,
    duration: formation.data.duration,
    participants: formation.data.participants,
    level: formation.data.level,
    price: formation.data.price,
    description: formation.data.description,
    program: formation.data.features,
    badge: formation.data.badge
  })) : [
    // Fallback data if no formations in database
    {
      id: 1,
      title: "Initiation au Maquillage",
      subtitle: "Les Fondamentaux",
      duration: "3 heures",
      participants: "1-3 personnes",
      level: "Débutant",
      price: "120€",
      description: "Découvrez les bases du maquillage et apprenez à sublimer votre beauté naturelle au quotidien.",
      program: [
        "Préparation de la peau",
        "Techniques de base du teint",
        "Mise en valeur du regard",
        "Harmonisation des couleurs",
        "Kit de démarrage offert"
      ],
      badge: "Populaire"
    }
  ];

  const advantages = [
    {
      icon: <Award className="w-6 h-6" />,
      title: "Formatrice Certifiée",
      description: "15 ans d'expérience et formations continues"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Groupes Réduits",
      description: "Attention personnalisée garantie"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Support Complet",
      description: "Manuel et suivi post-formation inclus"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Produits Fournis",
      description: "Matériel professionnel haut de gamme"
    }
  ];

  return (
    <section id="formations" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-wide uppercase text-sm mb-4">
            Formations
          </p>
          <h2 className="font-elegant text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Apprenez l'Art du
            <span className="block bg-gradient-luxury bg-clip-text text-transparent">
              Maquillage
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transmettez votre passion avec des formations complètes et personnalisées. 
            De l'initiation au perfectionnement professionnel.
          </p>
        </div>

        {/* Formations Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {formationsData.map((formation, index) => (
            <Card 
              key={formation.id} 
              className="group bg-gradient-card border-border/50 hover-glow overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`
                      inline-block px-3 py-1 text-xs font-medium rounded-full
                      ${formation.badge === 'Populaire' ? 'bg-primary text-white' : ''}
                      ${formation.badge === 'Nouveau' ? 'bg-accent text-white' : ''}
                      ${formation.badge === 'Certifiante' ? 'bg-gradient-luxury text-white' : ''}
                      ${formation.badge === 'Spécialisé' ? 'bg-secondary text-foreground' : ''}
                    `}>
                      {formation.badge}
                    </span>
                  </div>
                  
                  <div className="p-8 space-y-6">
                    <div>
                      <h3 className="font-elegant text-2xl font-bold text-foreground mb-2">
                        {formation.title}
                      </h3>
                      <p className="text-primary font-medium">{formation.subtitle}</p>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      {formation.description}
                    </p>

                    {/* Formation Details */}
                    <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-border/30">
                      <div className="text-center">
                        <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground mb-1">Durée</p>
                        <p className="text-sm font-medium text-foreground">{formation.duration}</p>
                      </div>
                      <div className="text-center">
                        <Users className="w-5 h-5 text-primary mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground mb-1">Participants</p>
                        <p className="text-sm font-medium text-foreground">{formation.participants}</p>
                      </div>
                      <div className="text-center">
                        <Award className="w-5 h-5 text-primary mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground mb-1">Niveau</p>
                        <p className="text-sm font-medium text-foreground">{formation.level}</p>
                      </div>
                    </div>

                    {/* Program */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Programme inclus :</h4>
                      <ul className="space-y-2">
                        {formation.program.map((item, idx) => (
                          <li key={idx} className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <span className="font-elegant text-2xl font-bold text-primary">
                          {formation.price}
                        </span>
                        <span className="text-sm text-muted-foreground ml-1">/ personne</span>
                      </div>
                      <Button className="bg-gradient-luxury text-white group-hover:shadow-lg transition-all"
                        onClick={() => {
                          // Navigate to individual formation page
                          const slug = formations[index]?.id || `formation-${formation.id}`;
                          window.location.href = `/formations/${slug}`;
                        }}>
                        Réserver
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Advantages */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((advantage, index) => (
            <Card 
              key={index} 
              className="bg-gradient-card border-border/50 hover-glow text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-luxury rounded-full text-white">
                    {advantage.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {advantage.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {advantage.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Formations;