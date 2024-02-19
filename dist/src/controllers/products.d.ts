import { Request, Response } from "express";
export declare function getProducts(req: Request, res: Response): Promise<void>;
export declare function addProducts(req: Request, res: Response): Promise<void>;
export declare function updateProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteProducts(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
