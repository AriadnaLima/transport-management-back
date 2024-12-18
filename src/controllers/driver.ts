import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Request, Response } from "express";
import { createDriverSchema } from "../dto/driver";

class DriverController {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;

  constructor(
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
  ) {
    this.prisma = prisma;
  }

  getDriver = async (req: Request, res: Response) => {
    try {
      const filter = { name: req.query.name } as { name: string };

      const drivers = await this.prisma.driver.findMany({
        where: filter,
        include: {
          Delivery: {
            where: {
              finishAt: null
            }
          }
        }
      });
      res.json(drivers);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  createDriver = async (req: Request, res: Response) => {
    try {
      const body = createDriverSchema.parse(req.body);

      const newDriver = await this.prisma.driver.create({
        data: body,
      });

      res.json(newDriver);
    } catch (err) {
      res.status(400).json(err);
    }
  };
}

export default DriverController;
