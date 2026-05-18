import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['Plaques & Signs', 'Storage', 'Stands', 'Pet Tags', 'Other']),
    price: z.number(),
    description: z.string(),
    image: z.string(),
    squareLink: z.string().url(),
    inStock: z.boolean().default(true),
    featured: z.boolean().default(false),
    isDeposit: z.boolean().default(false),
    totalPrice: z.number().optional(),
  }),
});

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    material: z.string(),
    image: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { products, portfolio };
