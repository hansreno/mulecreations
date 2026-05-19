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
    squareShipLink: z.string().url().optional(),
    shipPrice: z.number().optional(),
    inStock: z.boolean().default(true),
    featured: z.boolean().default(false),
    isDeposit: z.boolean().default(false),
    totalPrice: z.number().optional(),
    buttonLabel: z.string().optional(),
    sortOrder: z.number().default(99),
    gallery: z.array(z.string()).optional(),
  }),
});

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.string(),
    image: z.string(),
    material: z.string().optional(),
    category: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { products, portfolio };
