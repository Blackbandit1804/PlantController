import { Vector3 } from "alt-server";

export default interface IPlantDocument {
    _id?: string;
    owner: string;
    data: Array<IPlant>;
}

export interface IPlant {
    _id?: string;

    isCrime?: boolean;

    model: string;
    textLabel: string;
    
    seeds: boolean;
    fertilized: boolean;
    watered: boolean;

    growth: number;
    timeLeft: number;

    position: Vector3;
}