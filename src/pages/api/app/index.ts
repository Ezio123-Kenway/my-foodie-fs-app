// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/utils/db";
import { getQrCodeUrl } from "@/utils/fileUpload";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  console.log("session: ", session);
  if (!session) return res.status(401).send("Unauthorized");
  const user = session.user;
  const email = user?.email as string;
  const name = user?.name as string;
  const dbUser = await prisma.user.findUnique({ where: { email } });
  if (!dbUser) {
    // 1. Create new company
    const newCompanyName = "Default Company";
    const newCompanyAddress = "No.51 32st Street, Yangon";
    const company = await prisma.company.create({
      data: { name: newCompanyName, address: newCompanyAddress },
    });

    // 2. Create new user
    await prisma.user.create({
      data: { email, name, companyId: company.id },
    });

    // 3. Create new location
    const newLocationName = "Default Location";
    const newLocationAddress = "No.51 32st Street, Yangon";
    const location = await prisma.location.create({
      data: {
        name: newLocationName,
        address: newLocationAddress,
        companyId: company.id,
      },
    });

    // 4. Create new menu-category
    const newMenuCategoryName = "Default Menu Category";
    const menuCategory = await prisma.menuCategory.create({
      data: { name: newMenuCategoryName, companyId: company.id },
    });

    // 5. Create new menu
    const newMenuName = "Default Menu";
    const menu = await prisma.menu.create({
      data: { name: newMenuName, price: 100 },
    });

    // 6. Create new menuCategoryMenu
    const menuCategoryMenu = await prisma.menuCategoryMenu.create({
      data: { menuCategoryId: menuCategory.id, menuId: menu.id },
    });

    // 7. Create new addonCategory
    const newAddonCategoryName = "Default Addon Category";
    const addonCategory = await prisma.addonCategory.create({
      data: { name: newAddonCategoryName, isRequired: true },
    });

    // 8 Create new menuAddonCategory
    const menuAddonCategory = await prisma.menuAddonCategory.create({
      data: { menuId: menu.id, addonCategoryId: addonCategory.id },
    });

    // 9 Create new addons
    const newAddonNameOne = "Default addon 1";
    const newAddonNameTwo = "Default addon 2";
    const newAddonNameThree = "Default addon 3";
    const newAddonsData = [
      { name: newAddonNameOne, addonCategoryId: addonCategory.id },
      { name: newAddonNameTwo, addonCategoryId: addonCategory.id },
      { name: newAddonNameThree, addonCategoryId: addonCategory.id },
    ];
    const addons = await prisma.$transaction(
      newAddonsData.map((addon) => prisma.addon.create({ data: addon }))
    );

    // 10. Create new table
    const newTableName = "Default Table";
    const table = await prisma.table.create({
      data: { name: newTableName, locationId: location.id, assetUrl: "" },
    });
    const assetUrl = getQrCodeUrl(company.id, table.id);
    const tableWithAssetUrl = await prisma.table.update({
      where: { id: table.id },
      data: { assetUrl },
    });

    return res.status(200).json({
      location,
      menuCategory,
      menu,
      menuCategoryMenu,
      menuAddonCategory,
      addonCategory,
      addons,
      tableWithAssetUrl,
    });
  } else {
    // 1. get company id from current user
    const companyId = dbUser.companyId;

    // 2. find locations
    const locations = await prisma.location.findMany({
      where: { companyId, isArchived: false },
    });
    const locationIds = locations.map((location) => location.id);

    // 3. find menu categories
    const menuCategories = await prisma.menuCategory.findMany({
      where: { companyId, isArchived: false },
    });
    const menuCategoryIds = menuCategories.map(
      (menuCategory) => menuCategory.id
    );

    // 4 find menus
    const menuCategoryMenus = await prisma.menuCategoryMenu.findMany({
      where: { menuCategoryId: { in: menuCategoryIds }, isArchived: false },
    });
    const menuIds = menuCategoryMenus.map((item) => item.menuId);
    const menus = await prisma.menu.findMany({
      where: { id: { in: menuIds }, isArchived: false },
    });

    // 5 find addonCategories
    const menuAddonCategories = await prisma.menuAddonCategory.findMany({
      where: { menuId: { in: menuIds }, isArchived: false },
    });
    const addonCategoryIds = menuAddonCategories.map(
      (element) => element.addonCategoryId
    );
    const addonCategories = await prisma.addonCategory.findMany({
      where: { id: { in: addonCategoryIds }, isArchived: false },
    });

    // 6 find addons
    const addons = await prisma.addon.findMany({
      where: { addonCategoryId: { in: addonCategoryIds }, isArchived: false },
    });

    // 7 find tables
    const tables = await prisma.table.findMany({
      where: { locationId: { in: locationIds }, isArchived: false },
    });

    // 8 response all founded data
    return res.status(200).json({
      locations,
      menuCategories,
      menus,
      menuCategoryMenus,
      addonCategories,
      menuAddonCategories,
      addons,
      tables,
    });
  }

  res.status(200).json(dbUser);
}
