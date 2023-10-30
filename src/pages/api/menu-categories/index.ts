import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/utils/db";
import { NewMenuCategory } from "@/components/NewMenuCategory";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).send("Unauthorized");
  const method = req.method;
  if (method === "POST") {
    const { name, locationId } = req.body;
    const isValid = name && locationId;
    if (!isValid) return res.status(400).send("Bad request");
    const location = await prisma.location.findUnique({
      where: { id: locationId },
    });
    if (!location) return res.status(400).send("Bad request");
    const companyId = location.companyId;
    const newMenuCategory = await prisma.menuCategory.create({
      data: { name, companyId },
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
    const menuIds = (await prisma.menuCategoryMenu.findMany()).map(
      (item) => item.menuId
    );
    const handleUniqueIds = (myIds: number[]) => {
      return myIds.filter((myId) =>
        myIds.filter((item) => item === myId).length === 1 ? true : false
      );
    };
    const uniqueMenuIds = handleUniqueIds(menuIds);
    const menuCategoryMenus = relatedMenuCategoryMenus.filter((item) =>
      uniqueMenuIds.includes(item.menuId)
    );

    const menuIdsToDelete = menuCategoryMenus.map((element) => element.menuId);
    const relatedMenuAddonCategories = await prisma.menuAddonCategory.findMany({
      where: { menuId: { in: menuIdsToDelete }, isArchived: false },
    });
    const addonCategoryIds = (await prisma.menuAddonCategory.findMany()).map(
      (item) => item.addonCategoryId
    );
    const uniqueAddonCategoryIds = handleUniqueIds(addonCategoryIds);
    const menuAddonCategories = relatedMenuAddonCategories.filter((element) =>
      uniqueAddonCategoryIds.includes(element.addonCategoryId)
    );

    const addonCategoryIdsToDelete = menuAddonCategories.map(
      (menuAddonCategory) => menuAddonCategory.addonCategoryId
    );

    await prisma.menuCategoryMenu.updateMany({
      where: { menuCategoryId },
      data: { isArchived: true },
    });
    await prisma.menuAddonCategory.updateMany({
      where: { menuId: { in: menuIdsToDelete } },
      data: { isArchived: true },
    });
    await prisma.addon.updateMany({
      where: { addonCategoryId: { in: addonCategoryIdsToDelete } },
      data: { isArchived: true },
    });
    await prisma.addonCategory.updateMany({
      where: { id: { in: addonCategoryIdsToDelete } },
      data: { isArchived: true },
    });
    await prisma.menu.updateMany({
      where: { id: { in: menuIdsToDelete } },
      data: { isArchived: true },
    });
    await prisma.menuCategory.update({
      where: { id: menuCategoryId },
      data: { isArchived: true },
    });

    // const menuIdsToRemove = await prisma.menuCategoryMenu.findMany({
    //   where: { menuId: { in: menuIdsToDelete }, isArchived: false },
    // });
    // const addonCategoryIdsToRemove = await prisma.menuAddonCategory.findMany({
    //   where: { id: { in: addonCategoryIdsToDelete }, isArchived: false },
    // });

    return res.status(200).json({ menuIdsToDelete, addonCategoryIdsToDelete });
  }
  res.status(405).send("Invalid method");
}
