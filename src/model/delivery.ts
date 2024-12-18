import { IDriver } from "./driver";
import { IProduct } from "./product";
import { ITruck } from "./truck";

export interface IDelivery {
    id: number,
    valuable: boolean,
    insurance: boolean,
    dangerous: boolean,
    loc: string,
    driverId: number,
    driver: IDriver
    truck: ITruck,
    truckId: number,
    createAt: string,
    updateAt: string,
    finishAt?: string,
    status: number,
    value: string,
    product: IProduct,
    productId: number,
    tax: string,
}