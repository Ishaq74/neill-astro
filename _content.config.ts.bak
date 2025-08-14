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
    return await DatabaseUtil.withDatabase('services.sqlite', (db) => {
      const rows = db.prepare('SELECT slug, title, description, icon_name, image_path, features, price, sort_order FROM services ORDER BY sort_order').all();
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
    return await DatabaseUtil.withDatabase('team.sqlite', (db) => {
      const rows = db.prepare(`
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
    return await DatabaseUtil.withDatabase('testimonials.sqlite', (db) => {
      const rows = db.prepare('SELECT slug, name, role, image_path, rating, text, service, sort_order FROM testimonials ORDER BY sort_order').all();
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
    return await DatabaseUtil.withDatabase('formations.sqlite', (db) => {
      const rows = db.prepare(`
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
          imagePath: row.image_path || '',
          badge: row.badge,
          sortOrder: row.sort_order,
        };
      });
    });
  }
});

const faqs = defineCollection({
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    category: z.string(),
    sortOrder: z.number(),
    isActive: z.boolean()
  }),
  loader: async () => {
    return await DatabaseUtil.withDatabase('faqs.sqlite', (db) => {
      const rows = db.prepare(`
        SELECT id, question, answer, category, sort_order, is_active 
        FROM faqs WHERE is_active = 1 ORDER BY sort_order
      `).all();

      return rows.map((row) => {
        return {
          id: row.id.toString(),
          question: row.question,
          answer: row.answer,
          category: row.category,
          sortOrder: row.sort_order,
          isActive: row.is_active === 1,
        };
      });
    });
  }
});

const siteSettings = defineCollection({
  schema: z.object({
    siteName: z.string(),
    siteDescription: z.string(),
    contactEmail: z.string(),
    contactPhone: z.string(),
    contactAddress: z.string(),
    socialInstagram: z.string().optional(),
    socialFacebook: z.string().optional(),
    socialTiktok: z.string().optional(),
    businessHours: z.string().optional()
  }),
  loader: async () => {
    return await DatabaseUtil.withDatabase('site_settings.sqlite', (db) => {
      const rows = db.prepare(`
        SELECT id, site_name, site_description, contact_email, contact_phone, contact_address,
               social_instagram, social_facebook, social_tiktok, business_hours 
        FROM site_settings LIMIT 1
      `).all();
      return rows.map((row) => {
        return {
          id: row.id.toString(),
          siteName: row.site_name,
          siteDescription: row.site_description,
          contactEmail: row.contact_email,
          contactPhone: row.contact_phone,
          contactAddress: row.contact_address,
          socialInstagram: row.social_instagram || '',
          socialFacebook: row.social_facebook || '',
          socialTiktok: row.social_tiktok || '',
          businessHours: row.business_hours || '',
        };
      });
    });
  }
});

const gallery = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    serviceId: z.number().optional(),
    images: z.array(z.string()),
    featuredImage: z.string(),
    isFeatured: z.boolean(),
    sortOrder: z.number()
  }),
  loader: async () => {
    return await DatabaseUtil.withDatabase('gallery.sqlite', (db) => {
      const rows = db.prepare(`
        SELECT slug, title, description, category, service_id, images, featured_image, 
               is_featured, sort_order
        FROM gallery ORDER BY sort_order
      `).all();

      return rows.map((row) => {
        return {
          id: row.slug,
          title: row.title,
          description: row.description,
          category: row.category,
          serviceId: row.service_id,
          images: row.images ? JSON.parse(row.images) : [],
          featuredImage: row.featured_image,
          isFeatured: row.is_featured === 1,
          sortOrder: row.sort_order,
        };
      });
    });
  }
});

export const collections = { services, team, testimonials, formations, faqs, siteSettings, gallery };