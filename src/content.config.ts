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
    // Temporarily disabled during Turso migration
    return [];
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
    // Temporarily disabled during Turso migration
    return [];
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
    // Temporarily disabled during Turso migration
    return [];
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
    // Temporarily disabled during Turso migration
    return [];
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
    // Temporarily disabled during Turso migration
    return [];
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
    // Temporarily disabled during Turso migration
    return [];
  }
});

export const collections = { services, team, testimonials, formations, faqs, gallery };