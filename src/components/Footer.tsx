import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

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

interface FooterProps {
  siteSettings?: SiteSettings;
}

const Footer = ({ siteSettings }: FooterProps) => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-luxury rounded-full flex items-center justify-center">
                <span className="text-white font-elegant font-bold text-lg">
                  {siteSettings?.siteName?.charAt(0) || "A"}
                </span>
              </div>
              <div>
                <h3 className="font-elegant text-xl font-bold">{siteSettings?.siteName || "Artisan Beauty"}</h3>
              </div>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              {siteSettings?.siteDescription || "L'artisane de votre beauté. Révélez votre éclat naturel avec notre approche unique et personnalisée du maquillage professionnel."}
            </p>
            <div className="flex space-x-3">
              {siteSettings?.socialInstagram && (
                <a
                  href={siteSettings.socialInstagram.startsWith('http') ? siteSettings.socialInstagram : `https://instagram.com/${siteSettings.socialInstagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-background/10 rounded-lg hover:bg-primary transition-colors cursor-pointer"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {siteSettings?.socialFacebook && (
                <a
                  href={siteSettings.socialFacebook.startsWith('http') ? siteSettings.socialFacebook : `https://facebook.com/${siteSettings.socialFacebook.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-background/10 rounded-lg hover:bg-primary transition-colors cursor-pointer"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="/services" className="hover:text-primary transition-colors">Maquillage Mariée</a></li>
              <li><a href="/services" className="hover:text-primary transition-colors">Maquillage Événementiel</a></li>
              <li><a href="/formations" className="hover:text-primary transition-colors">Formations Beauté</a></li>
              <li><a href="/services" className="hover:text-primary transition-colors">Consultations VIP</a></li>
              <li><a href="/services" className="hover:text-primary transition-colors">Relooking Complet</a></li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="/" className="hover:text-primary transition-colors">Accueil</a></li>
              <li><a href="/services" className="hover:text-primary transition-colors">Services</a></li>
              <li><a href="/formations" className="hover:text-primary transition-colors">Formations</a></li>
              <li><a href="/gallery" className="hover:text-primary transition-colors">Galerie</a></li>
              <li><a href="/#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-background/70">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{siteSettings?.contactAddress || "123 Rue de la Beauté, 75001 Paris"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>{siteSettings?.contactPhone || "+33 1 23 45 67 89"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{siteSettings?.contactEmail || "contact@artisanbeauty.fr"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-background/70">
            <p>&copy; 2024 {siteSettings?.siteName || "Artisan Beauty"}. Tous droits réservés.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/legal" className="hover:text-primary transition-colors">Mentions légales</a>
              <a href="/privacy" className="hover:text-primary transition-colors">Politique de confidentialité</a>
              <a href="/terms" className="hover:text-primary transition-colors">CGV</a>
              <a href="/admin" className="hover:text-primary transition-colors text-xs">Admin</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;