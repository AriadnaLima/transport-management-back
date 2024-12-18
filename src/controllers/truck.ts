import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Request, Response } from "express";
import { createTruckSchema } from "../dto/truck";

class TruckController {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;

  constructor(
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
  ) {
    this.prisma = prisma;
  }

  getTruck = async (req: Request, res: Response) => {
    try {
      const filter = { plate: req.query.plate } as { plate: string };

      const trucks = await this.prisma.truck.findMany({
        where: filter,
        include: {
          Delivery: {
            where: {
              finishAt: null
            }
          }
        }
      });

      res.json(trucks);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  createTruck = async (req: Request, res: Response) => {
    try {
      const body = createTruckSchema.parse(req.body);

      const handlePlateExists = await this.prisma.truck.findFirst({
        where: {
          plate: body.plate
        }
      })

      if(handlePlateExists) throw "Caminhão já cadastrado.";
      
      const newTruck = await this.prisma.truck.create({
        data: body,
      });

      res.json(newTruck);
    } catch (err) {
      res.status(400).json(err);
    }
  };
}

export default TruckController;
