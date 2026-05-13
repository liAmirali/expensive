import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().or(z.string().startsWith('/')).default('/api/v1'),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error('Invalid env vars:', z.treeifyError(parsed.error));
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
