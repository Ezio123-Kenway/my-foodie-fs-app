// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/db";
import { Location } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const { tableId } = req.query;
  const isValid = tableId;
  if (!isValid) return res.status(400).send("Bad request");
  if (method === "GET") {
    const table = await prisma.table.findUnique({
      where: { id: Number(tableId) },
    });
    const location = (await prisma.location.findUnique({
      where: { id: table?.locationId },
    })) as Location;
    const companyId = location.companyId;
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    let menuCategories = await prisma.menuCategory.findMany({
      where: { companyId, isArchived: false },
    });
    const menuCategoryIds = menuCategories.map(
      (menuCategory) => menuCategory.id
    );
    const disabledMenuCategoryIds = (
      await prisma.disabledLocationMenuCategory.findMany({
        where: { locationId: location.id },
      })
    ).map((item) => item.menuCategoryId);
    menuCategories = menuCategories.filter(
      (menuCategory) => !disabledMenuCategoryIds.includes(menuCategory.id)
    );

    const menuCategoryMenus = await prisma.menuCategoryMenu.findMany({
      where: { menuCategoryId: { in: menuCategoryIds }, isArchived: false },
    });
    const menuIds = menuCategoryMenus.map((item) => item.menuId);
    let menus = await prisma.menu.findMany({
      where: { id: { in: menuIds }, isArchived: false },
    });
    const disabledMenuIds = (
      await prisma.disabledLocationMenu.findMany({
        where: { locationId: location.id },
      })
    ).map((item) => item.menuId);
    menus = menus.filter((menu) => !disabledMenuIds.includes(menu.id));

    const menuAddonCategories = await prisma.menuAddonCategory.findMany({
      where: { menuId: { in: menuIds }, isArchived: false },
    });
    const addonCategoryIds = menuAddonCategories.map(
      (element) => element.addonCategoryId
    );
    const addonCategories = await prisma.addonCategory.findMany({
      where: { id: { in: addonCategoryIds }, isArchived: false },
    });

    const addons = await prisma.addon.findMany({
      where: {
        addonCategoryId: { in: addonCategoryIds },
        isArchived: false,
      },
    });

    const orders = await prisma.order.findMany({
      where: { tableId: Number(tableId) },
    });

    return res.status(200).json({
      company,
      locations: [],
      menuCategories,
      menus,
      menuCategoryMenus,
      addonCategories,
      menuAddonCategories,
      addons,
      tables: [table],
      disabledLocationMenuCategories: [],
      disabledLocationMenus: [],
      orders,
    });
    // res.status(200).json(dbUser);
  }
}
