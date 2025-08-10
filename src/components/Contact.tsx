import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Send, Check } from "lucide-react";
import { useState } from "react";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialInstagram?: string;
  socialFacebook?: string;
  socialTiktok?: string;
  businessHours?: string;
}

interface ContactProps {
  siteSettings?: SiteSettings;
}

const Contact = ({ siteSettings }: ContactProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setError(result.error || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Une erreur est survenue lors de l\'envoi du message');
    } finally {
      setIsSubmitting(false);
    }
  };
  // Parse business hours if available
  const parseBusinessHours = (hoursString?: string) => {
    if (!hoursString) {
      return [
        { days: "Lundi - Vendredi", hours: "9h - 19h" },
        { days: "Samedi", hours: "9h - 17h" },
        { days: "Dimanche", hours: "Sur RDV" }
      ];
    }
    // Simple parsing - can be enhanced later
    const lines = hoursString.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const [days, hours] = line.split(':').map(s => s.trim());
      return { days: days || line, hours: hours || '' };
    });
  };

  const businessHours = parseBusinessHours(siteSettings?.businessHours);
  return (
    <section id="contact" className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-wide uppercase text-sm mb-4">
            Contact
          </p>
          <h2 className="font-elegant text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Réservez Votre
            <span className="block bg-gradient-luxury bg-clip-text text-transparent">
              Consultation
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Prenez rendez-vous pour une consultation personnalisée. Je vous accompagne 
            dans la création de votre look idéal.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="bg-gradient-card border-border/50 luxury-shadow">
              <CardContent className="p-6">
                <h3 className="font-elegant text-xl font-semibold text-foreground mb-6">
                  Informations de Contact
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-foreground">Studio {siteSettings?.siteName || "Artisan Beauty"}</p>
                      <p className="text-sm text-muted-foreground">
                        {siteSettings?.contactAddress || "123 Rue de la Beauté, 75001 Paris, France"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                      <p className="font-medium text-foreground">{siteSettings?.contactPhone || "+33 1 23 45 67 89"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">{siteSettings?.contactEmail || "contact@artisanbeauty.fr"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <h3 className="font-elegant text-xl font-semibold text-foreground mb-6">
                  Horaires d'Ouverture
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      {businessHours.map((schedule, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-sm text-muted-foreground">{schedule.days}</span>
                          <span className="text-sm font-medium text-foreground">{schedule.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <h3 className="font-elegant text-xl font-semibold text-foreground mb-6">
                  Suivez-moi
                </h3>
                <div className="flex space-x-4">
                  {siteSettings?.socialInstagram && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-primary text-primary hover:bg-primary hover:text-white"
                      onClick={() => window.open(
                        siteSettings.socialInstagram?.startsWith('http') 
                          ? siteSettings.socialInstagram 
                          : `https://instagram.com/${siteSettings.socialInstagram?.replace('@', '')}`, 
                        '_blank'
                      )}
                    >
                      <Instagram className="w-4 h-4" />
                    </Button>
                  )}
                  {siteSettings?.socialFacebook && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-primary text-primary hover:bg-primary hover:text-white"
                      onClick={() => window.open(
                        siteSettings.socialFacebook?.startsWith('http') 
                          ? siteSettings.socialFacebook 
                          : `https://facebook.com/${siteSettings.socialFacebook?.replace('@', '')}`, 
                        '_blank'
                      )}
                    >
                      <Facebook className="w-4 h-4" />
                    </Button>
                  )}
                  {!siteSettings?.socialInstagram && !siteSettings?.socialFacebook && (
                    <p className="text-sm text-muted-foreground">Aucun réseau social configuré</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-border/50 luxury-shadow">
              <CardContent className="p-8">
                <h3 className="font-elegant text-2xl font-semibold text-foreground mb-6">
                  Demande de Rendez-vous
                </h3>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">Message envoyé !</h3>
                      <p className="text-muted-foreground">
                        Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        onClick={() => setIsSubmitted(false)}
                      >
                        Envoyer un autre message
                      </Button>
                    </div>
                  ) : (
                    <>
                      {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                        </div>
                      )}
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Prénom *
                          </label>
                          <Input 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Votre prénom" 
                            className="border-border/50" 
                            required 
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Email *
                          </label>
                          <Input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="votre@email.com" 
                            className="border-border/50" 
                            required 
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Téléphone
                          </label>
                          <Input 
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Votre numéro" 
                            className="border-border/50" 
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Sujet
                          </label>
                          <Input 
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="Sujet de votre message" 
                            className="border-border/50" 
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Message *
                        </label>
                        <Textarea 
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Décrivez vos attentes, l'occasion, vos préférences..."
                          className="border-border/50 min-h-[120px]"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full bg-gradient-luxury text-white hover-glow luxury-shadow"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Envoyer mon message
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;