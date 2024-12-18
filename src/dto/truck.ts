import { z } from "zod";

export const createTruckSchema = z.object({
    plate: z.string(),
});