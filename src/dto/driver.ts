import { z } from "zod";

export const createDriverSchema = z.object({
    name: z.string(),
});