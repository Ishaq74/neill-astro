import { defineCollection, z } from 'astro:content';
import { DatabaseUtil } from './lib/database';

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
    try {
      return await DatabaseUtil.withDatabase('services', async (db) => {
        const rows = await db.prepare('SELECT slug, title, description, icon_name, image_path, features, price, sort_order FROM services ORDER BY sort_order').all();
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
      });
    } catch (error) {
      console.warn('Services collection: Database not available, returning empty array');
      return [];
    }
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
    try {
      return await DatabaseUtil.withDatabase('team', async (db) => {
        const rows = await db.prepare(`
          SELECT slug, name, role, speciality, image_path, experience, description, 
                 certifications, achievements, social_instagram, social_linkedin, social_email, sort_order 
          FROM team_members ORDER BY sort_order
        `).all();

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
      });
    } catch (error) {
      console.warn('Team collection: Database not available, returning empty array');
      return [];
    }
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
    try {
      return await DatabaseUtil.withDatabase('testimonials', async (db) => {
        const rows = await db.prepare('SELECT slug, name, role, image_path, rating, text, service, sort_order FROM testimonials ORDER BY sort_order').all();
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
      });
    } catch (error) {
      console.warn('Testimonials collection: Database not available, returning empty array');
      return [];
    }
  }
});

const formations = defineCollection({
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    level: z.string(),
    duration: z.string(),
    participants: z.string(),
    price: z.string(),
    features: z.array(z.string()),
    imagePath: z.string().optional(),
    badge: z.string(),
    sortOrder: z.number()
  }),
  loader: async () => {
    try {
      return await DatabaseUtil.withDatabase('formations', async (db) => {
        const rows = await db.prepare(`
          SELECT slug, title, subtitle, description, level, duration, participants, price, 
                 features, image_path, badge, sort_order 
          FROM formations ORDER BY sort_order
        `).all();
        return rows.map((row) => {
          return {
            id: row.slug,
            title: row.title,
            subtitle: row.subtitle,
            description: row.description,
            level: row.level,
            duration: row.duration,
            participants: row.participants,
            price: row.price,
            features: row.features ? JSON.parse(row.features) : [],
            imagePath: row.image_path,
            badge: row.badge,
            sortOrder: row.sort_order,
          };
        });
      });
    } catch (error) {
      console.warn('Formations collection: Database not available, returning empty array');
      return [];
    }
  }
});

const faqs = defineCollection({
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    category: z.string().optional(),
    sortOrder: z.number()
  }),
  loader: async () => {
    try {
      return await DatabaseUtil.withDatabase('faqs', async (db) => {
        const rows = await db.prepare(`
          SELECT slug, question, answer, category, sort_order 
          FROM faqs ORDER BY sort_order
        `).all();
        return rows.map((row) => {
          return {
            id: row.slug,
            question: row.question,
            answer: row.answer,
            category: row.category,
            sortOrder: row.sort_order,
          };
        });
      });
    } catch (error) {
      console.warn('FAQs collection: Database not available, returning empty array');
      return [];
    }
  }
});

const gallery = defineCollection({
  schema: z.object({
    title: z.string(),
    imagePath: z.string(),
    category: z.string(),
    description: z.string().optional(),
    sortOrder: z.number()
  }),
  loader: async () => {
    try {
      return await DatabaseUtil.withDatabase('gallery', async (db) => {
        const rows = await db.prepare(`
          SELECT slug, title, image_path, category, description, sort_order 
          FROM gallery_items ORDER BY sort_order
        `).all();
        return rows.map((row) => {
          return {
            id: row.slug,
            title: row.title,
            imagePath: row.image_path,
            category: row.category,
            description: row.description,
            sortOrder: row.sort_order,
          };
        });
      });
    } catch (error) {
      console.warn('Gallery collection: Database not available, returning empty array');
      return [];
    }
  }
});

export const collections = { services, team, testimonials, formations, faqs, gallery };