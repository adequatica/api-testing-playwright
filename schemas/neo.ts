import { z } from 'zod';

export const schemaBrowse = z.object({
  links: z.object(),
  page: z.object(),
  near_earth_objects: z.array(z.object()).min(1),
});

export const schemaLookup = z.object({
  links: z.object(),
  id: z.string(),
  neo_reference_id: z.string(),
  name: z.string(),
  designation: z.string(),
  nasa_jpl_url: z.string(),
  absolute_magnitude_h: z.number(),
  estimated_diameter: z.object(),
  is_potentially_hazardous_asteroid: z.boolean(),
  close_approach_data: z.array(z.object()),
  orbital_data: z.object(),
  is_sentry_object: z.boolean(),
});
