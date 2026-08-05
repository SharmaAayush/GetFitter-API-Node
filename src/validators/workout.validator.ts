import Exercise from "@/models/exercise.model";
import WeightUnit from "@/models/weightunits.model";
import z from "zod";

const workoutExerciseSetSchema = z.object({
  setNumber: z.coerce.number().int().min(1, 'Set number must be at least 1'),
  reps: z.coerce.number().int().min(1, 'Reps must be at least 1'),
  weight: z.coerce.number().optional(),
  weightUnit: z.string().startsWith(WeightUnit.prefix, 'Invalid share code').optional(),
}).refine((set) => {
  if (set.weight && !set.weightUnit || set.weightUnit && !set.weight) {
    return false;
  }
}, 'Sets must have both weight and unit or neither.');

const workoutExerciseSchema = z.object({
  order: z.coerce.number().int().min(1, 'Order must be at least 1'),
  exerciseId: z.string().startsWith(Exercise.prefix, 'Invalid share code'),
  sets: z.array(workoutExerciseSetSchema),
});

export const createWorkoutRequestSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 character long'),
    description: z.string().optional(),
    estimatedDuration: z.coerce.number().int().positive('Estimated duration must be a positive number').optional(),
    exercises: z.array(workoutExerciseSchema),
  }),
});

export const updateWorkoutRequestSchema = z.object({
  params: z.object({
    id: z.string().startsWith('WKT', 'Invalid workout share code'),
  }),
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 character long').optional(),
    description: z.string().optional(),
    estimatedDuration: z.coerce.number().int().positive('Estimated duration must be a positive number').optional(),
    exercises: z.array(workoutExerciseSchema).optional(),
  }),
});