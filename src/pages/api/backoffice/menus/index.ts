import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/db";
import { CreateMenuOptions, UpdateMenuOptions } from "@/types/menu";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "GET") {
    const menus = await prisma.menu.findMany({ where: { isArchived: false } });
    return res.status(200).send(menus);
  } else if (method === "POST") {
    const { name, price, imageUrl, menuCategoryIds } =
      req.body as CreateMenuOptions;
    const isValid = name && price !== undefined && menuCategoryIds.length > 0;
    if (!isValid) return res.status(400).send("Bad request");
    const data = { name, price, imageUrl };
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
  } else if (method === "PUT") {
    const {
      id,
      name,
      price,
      menuCategoryIds,
      locationId,
      isAvailable,
      imageUrl,
    } = req.body;
    const isValid =
      id && name && price !== undefined && menuCategoryIds.length > 0;
    if (!isValid) return res.status(400).send("Bad request");
    const exist = await prisma.menu.findUnique({ where: { id } });
    if (!exist) return res.status(400).send("Bad request");

    const updatedMenu = await prisma.menu.update({
      where: { id },
      data: { name, price, imageUrl },
    });
    await prisma.menuCategoryMenu.deleteMany({ where: { menuId: id } });
    const menuCategoryMenuDatas = menuCategoryIds.map((selectedId: number) => ({
      menuCategoryId: selectedId,
      menuId: id,
    }));
    const createdMenuCategoryMenus = await prisma.$transaction(
      menuCategoryMenuDatas.map(
        (data: { menuCategoryId: number; menuId: number }) =>
          prisma.menuCategoryMenu.create({ data })
      )
    );
    if (locationId && isAvailable === false) {
      const exist = await prisma.disabledLocationMenu.findFirst({
        where: { locationId, menuId: id },
      });
      if (exist)
        return res.status(200).send({ updatedMenu, createdMenuCategoryMenus });

      const disabledLocationMenu = await prisma.disabledLocationMenu.create({
        data: { locationId, menuId: id },
      });
      return res
        .status(200)
        .json({ updatedMenu, createdMenuCategoryMenus, disabledLocationMenu });
    } else if (locationId && isAvailable === true) {
      const exist = await prisma.disabledLocationMenu.findFirst({
        where: { locationId, menuId: id },
      });
      if (exist) {
        await prisma.disabledLocationMenu.delete({ where: { id: exist.id } });
      }

      return res.status(200).json({ updatedMenu, createdMenuCategoryMenus });
    }
    return res.status(200).json({ updatedMenu, createdMenuCategoryMenus });
  } else if (method === "DELETE") {
    const menuId = Number(req.query.id);
    if (!menuId) return res.status(400).send("Bad request");
    const menuToUpdate = await prisma.menu.findUnique({
      where: { id: menuId },
    });
    if (!menuToUpdate) return res.status(400).send("Bad request");

    const addonCategoryIds = (
      await prisma.menuAddonCategory.findMany({
        where: { menuId, isArchived: false },
      })
    ).map((item) => item.addonCategoryId);

    const addonCategoryIdsPromise = addonCategoryIds.map(
      async (addonCategoryId) => {
        const addonCategoryData = { addonCategoryId, count: 1 };
        const count = await prisma.menuAddonCategory.count({
          where: { addonCategoryId, isArchived: false },
        });
        addonCategoryData.count = count;
        return addonCategoryData;
      }
    );

    const addonCategoryIdsToArchive = (
      await Promise.all(addonCategoryIdsPromise)
    )
      .filter((item) => item.count === 1)
      .map((element) => element.addonCategoryId);

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

    await prisma.menuAddonCategory.updateMany({
      where: { menuId },
      data: { isArchived: true },
    });
    await prisma.menu.update({
      where: { id: menuId },
      data: { isArchived: true },
    });

    return res.status(200).send("Deleted");
  }
  res.status(405).json("Invalid method");
}
