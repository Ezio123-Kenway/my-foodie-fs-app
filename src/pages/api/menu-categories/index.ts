import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).send("Unauthorized");
  const user = session.user;
  const email = user?.email as string;
  const dbUser = await prisma.user.findUnique({ where: { email } });
  if (!dbUser) return res.status(401).send("Unauthorized");
  const method = req.method;
  if (method === "POST") {
    const { name, locationId } = req.body;
    const isValid = name;
    if (!isValid) return res.status(400).send("Bad request");
    // const location = await prisma.location.findUnique({
    //   where: { id: locationId },
    // });
    // if (!location) return res.status(400).send("Bad request");
    // const companyId = location.companyId;
    const newMenuCategory = await prisma.menuCategory.create({
      data: { name, companyId: dbUser.companyId },
    });
    return res.status(200).json({ newMenuCategory });
  } else if (method === "PUT") {
    const { id, name } = req.body;
    const isValid = id && name;
    if (!isValid) return res.status(400).send("Bad request");
    const menuCategoryToUpdate = await prisma.menuCategory.findUnique({
      where: { id },
    });
    if (!menuCategoryToUpdate) return res.status(400).send("Bad request");
    const updatedMenuCategory = await prisma.menuCategory.update({
      where: { id },
      data: { name },
    });
    return res.status(200).json({ updatedMenuCategory });
  } else if (method === "DELETE") {
    const menuCategoryId = Number(req.query.id);
    if (!menuCategoryId) return res.status(400).send("Bad request");
    const menuCategoryToDelete = await prisma.menuCategory.findUnique({
      where: { id: menuCategoryId },
    });
    if (!menuCategoryToDelete) return res.status(400).send("Bad request");
    const relatedMenuCategoryMenus = await prisma.menuCategoryMenu.findMany({
      where: { menuCategoryId },
    });
    const menuIds = relatedMenuCategoryMenus.map((item) => item.menuId);
    menuIds.forEach(async (menuId) => {
      const menuCategoryMenuRows = await prisma.menuCategoryMenu.findMany({
        where: { menuId, isArchived: false },
      });
      if (menuCategoryMenuRows.length === 1) {
        // one menu is connected to only one menu-category
        await prisma.menuCategoryMenu.updateMany({
          where: { menuCategoryId, menuId },
          data: { isArchived: true },
        });
        await prisma.menuAddonCategory.updateMany({
          where: { menuId },
          data: { isArchived: true },
        });
      } else {
        // one menu is connected to many menu-categories
        await prisma.menuCategoryMenu.updateMany({
          where: { menuCategoryId },
          data: { isArchived: true },
        });
      }
    });
    await prisma.menuCategory.update({
      where: { id: menuCategoryId },
      data: { isArchived: true },
    });
    return res.status(200).json("Deleted");
  }
  res.status(405).send("Invalid method");
}
