import { Request, Response } from "express";
export declare function getSuppliers(req: Request, res: Response): Promise<void>;
export declare function addSupplier(req: Request, res: Response): Promise<void>;
export declare function updateSupplier(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteSupplier(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
