import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { CreateMenuType } from "@/types/menu";
import { prisma } from "@/utils/db";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).send("Unauthorized");

  const method = req.method;
  if (method === "PUT") {
    const menuId = Number(req.query.id);
    if (!menuId) return res.status(400).send("Bad request");
    const name = req.body.name as string;
    const price = req.body.price as number;
    const updatedMenu = await prisma.menu.update({
      where: { id: menuId },
      data: { name, price },
    });
    return res.status(200).send(updatedMenu);
  } else if (method === "DELETE") {
    const menuId = Number(req.query.id);
    if (!menuId) return res.status(400).send("Bad request");
    await prisma.menu.update({
      where: { id: menuId },
      data: { isArchived: true },
    });
    return res.status(200).send("Deleted");
  }
  res.status(200).json({ name: "John Doe" });
}
