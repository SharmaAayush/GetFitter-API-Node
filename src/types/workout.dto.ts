import { createWorkoutRequestSchema } from "@/validators/workout.validator";
import z from "zod";

export type CreateWorkoutRequest = z.infer<typeof createWorkoutRequestSchema>;