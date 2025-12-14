import { z } from 'zod';

// All properties are required by default
export const schema = z.object({
  date: z.string(),
  explanation: z.string(),
  media_type: z.string(),
  // Custom validation logic via refinements https://zod.dev/?id=refine
  service_version: z.string().refine((value) => value === 'v1'),
  title: z.string(),
  url: z.string(),
});
