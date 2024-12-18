import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { createDeliverySchema } from "../dto/delivery";
import { Categories } from "../constants/categories";
import { Request, Response } from "express";

class DeliveryController {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;

  constructor(
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
  ) {
    this.prisma = prisma;
  }

getDelivery = async (req: Request, res: Response) => {
    try {
      const filter = {
        driverId: req.query?.driverId ? Number(req.query.driverId) : undefined,
        truckId: req.query?.truckId ? Number(req.query.truckId) : undefined,
      };

      const deliverys = await this.prisma.delivery.findMany({
        where: filter,
        include: {
          truck: true,
          driver: true,
        },
      });

      res.json(deliverys);
    } catch (err) {
      res.status(400).json(err);
    }
  }

createDelivery = async (req: Request, res: Response) => {
    try {
      const body = createDeliverySchema.parse(req.body);

      const product = await this.prisma.product.findFirst({
        select: {
          category: true,
          value: true,
        },
        where: {
          id: body.productId,
        },
      });

      if (!product) throw "Produto não encontrado";

      const truckInRoute = await this.prisma.delivery.count({
        where: {
          truckId: body.truckId,
          finishAt: null,
        },
      });

      if (truckInRoute) throw "Caminhão em rota";

      const driverInRoute = await this.prisma.delivery.count({
        where: {
          driverId: body.driverId,
          finishAt: null,
        },
      });

      if (driverInRoute) throw "Motorista em rota";

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const countDriver = await this.prisma.delivery.count({
        where: {
          driverId: body.driverId,
          createAt: {
            gte: firstDayOfMonth,
            lte: lastDayOfMonth,
          },
        },
      });
      
      if (countDriver > 2) throw "Motorista ja realizou 2 entregas esse mes";

      const countTruck = await this.prisma.delivery.count({
        where: {
          truckId: body.truckId,
          createAt: {
            gte: firstDayOfMonth,
            lte: lastDayOfMonth,
          },
        },
      });

      if (countTruck > 4) throw "Caminhão ja realizou 4 entregas esse mes";

      const valuable = Number(product?.value) > 30000;
      const insurance = product.category === Categories.ELETRONICS;
      const dangerous = product.category === Categories.FUEL;
      const tax = this.getTax(body.loc, Number(body.value));

      const newDelivery = await this.prisma.delivery.create({
        data: {
          ...body,
          tax: String(tax),
          valuable,
          insurance,
          dangerous,
        },
      });

      res.json(newDelivery);
    } catch (err) {
      res.status(400).json(err);
    }
  }

updateDelivery = async (req: Request, res: Response) => {
    try {
      const delivery = req.body.deliveryId;
      await this.prisma.delivery.update({
        where: {
          id: delivery,
          finishAt: null,
        },
        data: {
          finishAt: new Date(),
        },
      });

      res.send();
    } catch (err) {
      res.send(err);
    }
  }

  getTax(loc: string, productValue: number) {
    if (loc === "Nordeste") {
      return productValue * 0.2;
    } else if (loc === "Amazonia") {
      return productValue * 0.3;
    } else if (loc === "Argentina") {
      return productValue * 0.4;
    } else {
      return 0;
    }
  }
} 

export default DeliveryController;
