import { z } from "zod";

export const createProductSchema = z.object({
    category: z.number(),
    value: z.string(),
});