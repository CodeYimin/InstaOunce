import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export interface MyContext {
  prisma: PrismaClient;
  req: Request & { session: MySession };
  res: Response;
}

export interface MySession {
  userId?: string;
}
