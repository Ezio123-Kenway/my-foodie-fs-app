import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/utils/db";
import { CreateMenuOptions, UpdateMenuOptions } from "@/types/menu";

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
    const isValid = name && price !== undefined && menuCategoryIds.length > 0;
    if (!isValid) return res.status(400).send("Bad request");
    const newMenu = await prisma.menu.create({ data: { name, price } });
    const menuCategoryMenusData: { menuCategoryId: number; menuId: number }[] =
      menuCategoryIds.map((selectedId) => ({
        menuCategoryId: selectedId,
        menuId: newMenu.id,
      }));
    const newMenuCategoryMenus = await prisma.$transaction(
      menuCategoryMenusData.map((data) =>
        prisma.menuCategoryMenu.create({ data })
      )
    );
    return res.status(200).send({ newMenu, newMenuCategoryMenus });
  } else if (method === "PUT") {
    const { id, name, price, menuCategoryIds } = req.body as UpdateMenuOptions;
    const isValid =
      id && name && price !== undefined && menuCategoryIds.length > 0;
    if (!isValid) return res.status(400).send("Bad request");
    const updatedMenu = await prisma.menu.update({
      where: { id },
      data: { name, price },
    });
    await prisma.menuCategoryMenu.deleteMany({ where: { menuId: id } });
    const menuCategoryMenusData: { menuCategoryId: number; menuId: number }[] =
      menuCategoryIds.map((selectedId) => ({
        menuCategoryId: selectedId,
        menuId: id,
      }));
    const createdMenuCategoryMenus = await prisma.$transaction(
      menuCategoryMenusData.map((data) =>
        prisma.menuCategoryMenu.create({ data })
      )
    );
    return res.status(200).send({ updatedMenu, createdMenuCategoryMenus });
  } else if (method === "DELETE") {
    const menuId = Number(req.query.id);
    if (!menuId) return res.status(400).send("Bad request");
    const menuToDelete = await prisma.menu.findUnique({
      where: { id: menuId },
    });
    if (!menuToDelete) return res.status(400).send("Bad request");
    await prisma.menu.update({
      where: { id: menuId },
      data: { isArchived: true },
    });
    return res.status(200).send("Deleted");
  }
  res.status(405).json("Invalid method");
}
