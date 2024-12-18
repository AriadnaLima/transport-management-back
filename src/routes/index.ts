import {Router} from "express";
import DeliveryController from "../controllers/delivery";
import DriverController from "../controllers/driver";
import TruckController from "../controllers/truck";
import ProductController from "../controllers/product";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

const deliveryController = new DeliveryController(prisma)
router.get("/delivery", deliveryController.getDelivery);
router.post("/delivery", deliveryController.createDelivery);
router.put("/delivery", deliveryController.updateDelivery);

const driverController = new DriverController(prisma)
router.get("/driver", driverController.getDriver);
router.post("/driver",driverController.createDriver);

const productController = new ProductController(prisma)
router.get("/product",productController.getProduct);
router.post("/product",productController.createProduct);

const truckController = new TruckController(prisma)
router.get("/truck", truckController.getTruck);
router.post("/truck", truckController.createTruck);

export default router;