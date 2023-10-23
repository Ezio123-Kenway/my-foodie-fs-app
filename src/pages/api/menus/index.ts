import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/utils/db";
import { CreateMenuOptions } from "@/types/menu";

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
    const { name, price, menuCategoryIds } = req.body as CreateMenuOptions;
    const isValid = name && price > 0 && menuCategoryIds.length;
    if (!isValid) return res.status(400).send("Bad request");
    const data = { name, price };
    const newMenu = await prisma.menu.create({ data });
    const menuCategoryMenuDatas = menuCategoryIds.map((menuCategoryId) => ({
      menuCategoryId,
      menuId: newMenu.id,
    }));
    const menuCategoryMenus = await prisma.$transaction(
      menuCategoryMenuDatas.map((menuCategoryMenuData) =>
        prisma.menuCategoryMenu.create({ data: menuCategoryMenuData })
      )
    );
    return res.status(200).send({ newMenu, menuCategoryMenus });
  } else if (method === "DELETE") {
    const menuId = Number(req.query.id);
    if (!menuId) return res.status(400).send("Bad request");
    const menuToUpdate = await prisma.menu.findUnique({
      where: { id: menuId },
    });
    if (!menuToUpdate) return res.status(400).send("Bad request");
    await prisma.menu.update({
      where: { id: menuId },
      data: { isArchived: true },
    });
    return res.status(200).send("Deleted");
  }
  res.status(405).json("Invalid method");
}
