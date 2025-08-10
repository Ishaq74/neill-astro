import { defineCollection, z } from 'astro:content';
import Database from 'better-sqlite3';

const services = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    iconName: z.string(),
    imagePath: z.string(),
    features: z.array(z.string()),
    price: z.string(),
    sortOrder: z.number()
  }),
  loader: async () => {
    const db = new Database('./data/services.sqlite');
    const rows = db.prepare('SELECT slug, title, description, icon_name, image_path, features, price, sort_order FROM services ORDER BY sort_order').all();
    db.close();

    return rows.map((row) => {
      return {
        id: row.slug,
        title: row.title,
        description: row.description,
        iconName: row.icon_name,
        imagePath: row.image_path,
        features: row.features ? JSON.parse(row.features) : [],
        price: row.price,
        sortOrder: row.sort_order,
      };
    });
  }
});

const team = defineCollection({
  schema: z.object({
    name: z.string(),
    role: z.string(),
    speciality: z.string(),
    imagePath: z.string(),
    experience: z.string(),
    description: z.string(),
    certifications: z.array(z.string()).optional(),
    achievements: z.array(z.string()).optional(),
    social: z.object({
      instagram: z.string().optional(),
      linkedin: z.string().optional(),
      email: z.string().optional()
    }),
    sortOrder: z.number()
  }),
  loader: async () => {
    const db = new Database('./data/team.sqlite');
    const rows = db.prepare(`
      SELECT slug, name, role, speciality, image_path, experience, description, 
             certifications, achievements, social_instagram, social_linkedin, social_email, sort_order 
      FROM team_members ORDER BY sort_order
    `).all();
    db.close();

    return rows.map((row) => {
      return {
        id: row.slug,
        name: row.name,
        role: row.role,
        speciality: row.speciality,
        imagePath: row.image_path,
        experience: row.experience,
        description: row.description,
        certifications: row.certifications ? JSON.parse(row.certifications) : [],
        achievements: row.achievements ? JSON.parse(row.achievements) : [],
        social: {
          instagram: row.social_instagram || '',
          linkedin: row.social_linkedin || '',
          email: row.social_email || ''
        },
        sortOrder: row.sort_order,
      };
    });
  }
});

const testimonials = defineCollection({
  schema: z.object({
    name: z.string(),
    role: z.string(),
    imagePath: z.string(),
    rating: z.number(),
    text: z.string(),
    service: z.string(),
    sortOrder: z.number()
  }),
  loader: async () => {
    const db = new Database('./data/testimonials.sqlite');
    const rows = db.prepare('SELECT slug, name, role, image_path, rating, text, service, sort_order FROM testimonials ORDER BY sort_order').all();
    db.close();

    return rows.map((row) => {
      return {
        id: row.slug,
        name: row.name,
        role: row.role,
        imagePath: row.image_path,
        rating: row.rating,
        text: row.text,
        service: row.service,
        sortOrder: row.sort_order,
      };
    });
  }
});

export const collections = { services, team, testimonials };