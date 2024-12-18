import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Request, Response } from "express";
import { createProductSchema } from "../dto/product";

class ProductController {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;

  constructor(
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
  ) {
    this.prisma = prisma;
  }

  getProduct = async (req: Request, res: Response) => {
    try {
      const filter = {
        category: req.query?.category ? Number(req.query.category) : undefined,
        value: req.query?.value,
      } as { category: number; value: string };

      const products = await this.prisma.product.findMany({
        where: filter,
        include: {
          Delivery: {
            where: {
              finishAt: null
            }
          }
        }
      });

      res.json(products);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  createProduct = async (req: Request, res: Response) => {
    try {
      const body = createProductSchema.parse(req.body);

      const newTruck = await this.prisma.product.create({
        data: body,
      });

      res.json(newTruck);
    } catch (err) {
      res.status(400).json(err);
    }
  };
}

export default ProductController;
