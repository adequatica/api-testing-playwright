import { z } from 'zod';

// All properties are required by default
export const schema = z.object({
  copyright: z.string(),
  date: z.string(),
  explanation: z.string(),
  hdurl: z.string(),
  // Custom validation logic via refinements https://zod.dev/?id=refine
  media_type: z.string().refine((value) => value === 'image'),
  service_version: z.string(),
  title: z.string(),
  url: z.string(),
});
