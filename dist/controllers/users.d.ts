import { Request, Response } from "express";
export declare function getClients(req: Request, res: Response): Promise<void>;
export declare function addClient(req: Request, res: Response): Promise<void>;
export declare function updateClient(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteClient(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
