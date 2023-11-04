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
    const menuIds = (
      await prisma.menuCategoryMenu.findMany({
        where: { menuCategoryId, isArchived: false },
      })
    ).map((item) => item.menuId);
    const menuIdsPromise = menuIds.map(async (menuId) => {
      const menuData = { menuId, count: 1 };
      const count = await prisma.menuCategoryMenu.count({
        where: { menuId, isArchived: false },
      });
      menuData.count = count;
      return menuData;
    });

    const menuIdsToArchive = (await Promise.all(menuIdsPromise))
      .filter((item) => item.count === 1)
      .map((element) => element.menuId);
    console.log("menuIdsToArchive: ", menuIdsToArchive);

    const addonCategoryIds = (
      await prisma.menuAddonCategory.findMany({
        where: { menuId: { in: menuIdsToArchive }, isArchived: false },
      })
    ).map((item) => item.addonCategoryId);

    const addonCategoryIdsPromise = addonCategoryIds.map(
      async (addonCategoryId) => {
        const relatedMenuIds = (
          await prisma.menuAddonCategory.findMany({
            where: { addonCategoryId, isArchived: false },
          })
        ).map((item) => item.menuId);
        return relatedMenuIds.every((relatedMenuId) =>
          menuIdsToArchive.includes(relatedMenuId)
        )
          ? addonCategoryId
          : undefined;
      }
    );

    const addonCategoryIdsToArchive = (
      await Promise.all(addonCategoryIdsPromise)
    ).filter((item) => item !== undefined);

    console.log("addonCategoryIdsToArchive: ", addonCategoryIdsToArchive);

    for (const addonCategoryId of addonCategoryIdsToArchive) {
      await prisma.addon.updateMany({
        where: { addonCategoryId },
        data: { isArchived: true },
      });
      await prisma.addonCategory.update({
        where: { id: addonCategoryId },
        data: { isArchived: true },
      });
    }

    for (const menuId of menuIdsToArchive) {
      await prisma.menuAddonCategory.updateMany({
        where: { menuId },
        data: { isArchived: true },
      });
      await prisma.menu.update({
        where: { id: menuId },
        data: { isArchived: true },
      });
    }

    await prisma.menuCategoryMenu.updateMany({
      where: { menuCategoryId },
      data: { isArchived: true },
    });
    await prisma.menuCategory.update({
      where: { id: menuCategoryId },
      data: { isArchived: true },
    });

    return res.status(200).json("Deleted");
  }
  res.status(405).send("Invalid method");
}
