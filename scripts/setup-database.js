import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(__dirname, '..', 'data');

// Create services database
const servicesDb = new Database(join(dataDir, 'services.sqlite'));

servicesDb.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE,
    title TEXT,
    description TEXT,
    icon_name TEXT,
    image_path TEXT,
    features TEXT,
    price TEXT,
    sort_order INTEGER
  )
`);

const insertService = servicesDb.prepare(`
  INSERT OR REPLACE INTO services (slug, title, description, icon_name, image_path, features, price, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const services = [
  {
    slug: 'maquillage-professionnel',
    title: 'Maquillage Professionnel',
    description: 'Maquillage personnalisé pour tous vos événements spéciaux',
    icon_name: 'Palette',
    image_path: '/src/assets/service-makeup.jpg',
    features: JSON.stringify(['Mariages', 'Événements', 'Shooting photo', 'Soirées']),
    price: 'À partir de 80€',
    sort_order: 1
  },
  {
    slug: 'formations-beaute',
    title: 'Formations Beauté',
    description: 'Cours privés et ateliers pour maîtriser l\'art du maquillage',
    icon_name: 'GraduationCap',
    image_path: '/src/assets/service-formation.jpg',
    features: JSON.stringify(['Cours individuels', 'Ateliers groupe', 'Techniques avancées', 'Certification']),
    price: 'À partir de 120€',
    sort_order: 2
  },
  {
    slug: 'consultations-vip',
    title: 'Consultations VIP',
    description: 'Service premium avec analyse personnalisée complète',
    icon_name: 'Crown',
    image_path: '/src/assets/service-formation.jpg',
    features: JSON.stringify(['Analyse morphologique', 'Sélection produits', 'Routine beauté', 'Suivi personnalisé']),
    price: 'À partir de 200€',
    sort_order: 3
  },
  {
    slug: 'relooking-complet',
    title: 'Relooking Complet',
    description: 'Transformation complète pour révéler votre potentiel',
    icon_name: 'Sparkles',
    image_path: '/src/assets/service-makeup.jpg',
    features: JSON.stringify(['Conseil style', 'Maquillage', 'Coiffure', 'Shooting photo']),
    price: 'À partir de 350€',
    sort_order: 4
  }
];

services.forEach(service => {
  insertService.run(
    service.slug,
    service.title,
    service.description,
    service.icon_name,
    service.image_path,
    service.features,
    service.price,
    service.sort_order
  );
});

servicesDb.close();

// Create team database
const teamDb = new Database(join(dataDir, 'team.sqlite'));

teamDb.exec(`
  CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY,
    slug TEXT UNIQUE,
    name TEXT,
    role TEXT,
    speciality TEXT,
    image_path TEXT,
    experience TEXT,
    description TEXT,
    certifications TEXT,
    achievements TEXT,
    social_instagram TEXT,
    social_linkedin TEXT,
    social_email TEXT,
    sort_order INTEGER
  )
`);

const insertTeamMember = teamDb.prepare(`
  INSERT OR REPLACE INTO team_members (
    id, slug, name, role, speciality, image_path, experience, description, 
    certifications, achievements, social_instagram, social_linkedin, social_email, sort_order
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const teamMembers = [
  {
    id: 1,
    slug: 'marie-dubois',
    name: 'Marie Dubois',
    role: 'Fondatrice & Artiste Maquilleuse',
    speciality: 'Maquillage Mariée & Formations',
    image_path: '/src/assets/team-marie.jpg',
    experience: '15 ans',
    description: 'Passionnée par l\'art du maquillage depuis plus de 15 ans, Marie a formé des centaines de professionnels et sublimé plus de 500 mariées.',
    certifications: JSON.stringify(['CAP Esthétique-Cosmétique', 'Formation Internationale MUA', 'Spécialisation Maquillage Artistique']),
    achievements: JSON.stringify(['Prix Excellence Beauté 2023', 'Formatrice certifiée', '500+ mariées sublimées']),
    social_instagram: '@marie.artisanbeauty',
    social_linkedin: 'marie-dubois-mua',
    social_email: 'marie@artisanbeauty.fr',
    sort_order: 1
  },
  {
    id: 2,
    slug: 'camille-leroux',
    name: 'Camille Leroux',
    role: 'Assistante & Formatrice',
    speciality: 'Maquillage Naturel & Conseil',
    image_path: '/src/assets/team-assistant.jpg',
    experience: '5 ans',
    description: 'Spécialiste du maquillage naturel et du conseil beauté, Camille accompagne nos clientes dans leur quête de l\'élégance au quotidien.',
    certifications: JSON.stringify(['Formation Avancée MUA', 'Spécialisation Conseil Beauté', 'Certification Produits Bio']),
    achievements: JSON.stringify(['Experte maquillage naturel', '200+ consultations beauté', 'Spécialiste produits bio']),
    social_instagram: '@camille.beautycoach',
    social_linkedin: 'camille-leroux-beauty',
    social_email: 'camille@artisanbeauty.fr',
    sort_order: 2
  }
];

teamMembers.forEach(member => {
  insertTeamMember.run(
    member.id,
    member.slug,
    member.name,
    member.role,
    member.speciality,
    member.image_path,
    member.experience,
    member.description,
    member.certifications,
    member.achievements,
    member.social_instagram,
    member.social_linkedin,
    member.social_email,
    member.sort_order
  );
});

teamDb.close();

// Create testimonials database
const testimonialsDb = new Database(join(dataDir, 'testimonials.sqlite'));

testimonialsDb.exec(`
  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY,
    slug TEXT UNIQUE,
    name TEXT,
    role TEXT,
    image_path TEXT,
    rating INTEGER,
    text TEXT,
    service TEXT,
    sort_order INTEGER
  )
`);

const insertTestimonial = testimonialsDb.prepare(`
  INSERT OR REPLACE INTO testimonials (id, slug, name, role, image_path, rating, text, service, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const testimonials = [
  {
    id: 1,
    slug: 'sophie-laurent',
    name: 'Sophie Laurent',
    role: 'Mariée',
    image_path: '/lovable-uploads/451e8faf-a8ac-48e3-ad49-12d88d956273.png',
    rating: 5,
    text: 'Marie a su créer le look parfait pour mon mariage. Son professionnalisme et sa douceur m\'ont mise en confiance immédiatement. Le résultat était au-delà de mes attentes !',
    service: 'Maquillage Mariée',
    sort_order: 1
  },
  {
    id: 2,
    slug: 'camille-dubois',
    name: 'Camille Dubois',
    role: 'Directrice Marketing',
    image_path: '/lovable-uploads/451e8faf-a8ac-48e3-ad49-12d88d956273.png',
    rating: 5,
    text: 'Les formations de Marie sont exceptionnelles. J\'ai appris des techniques que j\'utilise au quotidien. Son approche pédagogique est remarquable.',
    service: 'Formation Beauté',
    sort_order: 2
  },
  {
    id: 3,
    slug: 'elise-martin',
    name: 'Élise Martin',
    role: 'Photographe',
    image_path: '/lovable-uploads/451e8faf-a8ac-48e3-ad49-12d88d956273.png',
    rating: 5,
    text: 'Je travaille régulièrement avec Marie pour mes shootings. Sa créativité et sa maîtrise technique sont impressionnantes. Mes clientes adorent !',
    service: 'Maquillage Artistique',
    sort_order: 3
  },
  {
    id: 4,
    slug: 'anne-claire-petit',
    name: 'Anne-Claire Petit',
    role: 'Entrepreneuse',
    image_path: '/lovable-uploads/451e8faf-a8ac-48e3-ad49-12d88d956273.png',
    rating: 5,
    text: 'La consultation VIP a transformé ma routine beauté. Marie a su comprendre mes besoins et m\'a donné des conseils précieux pour révéler ma beauté naturelle.',
    service: 'Consultation VIP',
    sort_order: 4
  }
];

testimonials.forEach(testimonial => {
  insertTestimonial.run(
    testimonial.id,
    testimonial.slug,
    testimonial.name,
    testimonial.role,
    testimonial.image_path,
    testimonial.rating,
    testimonial.text,
    testimonial.service,
    testimonial.sort_order
  );
});

testimonialsDb.close();

console.log('Databases created and populated successfully!');