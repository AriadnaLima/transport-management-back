import { z } from "zod";

export const createDeliverySchema = z.object({
    truckId: z.number(),
    driverId: z.number(),
    loc: z.string(),
    productId: z.number(),
    value: z.string(),
});