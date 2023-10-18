import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/utils/db";
import { CreateMenuType } from "@/types/menu";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).send("Unauthorized");

  const method = req.method;
  if (method === "GET") {
    const menus = await prisma.menu.findMany({ where: { isArchived: false } });
    return res.status(200).send(menus);
  } else if (method === "POST") {
    const { name, price, description } = req.body as CreateMenuType;
    const isValid = name && price;
    if (!isValid) return res.status(400).send("Bad request");
    const data = { name, price, description };
    const newMenu = await prisma.menu.create({ data });
    return res.status(200).send(newMenu);
  }
  res.status(405).json("Invalid method");
}
