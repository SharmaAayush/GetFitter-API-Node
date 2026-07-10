import Exercise from '@/models/exercise.model';
import { z } from 'zod';

export const getExercisesRequestSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1, 'Page must be 1 or greater').default(1).optional(),
    limit: z.coerce.number().int().optional(),
    name: z.string().optional(),
    force: z.string().optional(),
    level: z.string().optional(),
    mechanic: z.string().optional(),
    equipment: z.string().optional(),
    category: z.string().optional(),
    target: z.string().optional(),
  }),
});

export const getExerciseBySlugSchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
});

export const getExerciseByShareCodeSchema = z.object({
  params: z.object({
    shareCode: z.string().startsWith(Exercise.prefix, 'Invalid share code'),
  }),
});