import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/db";
import {
  CreateAddonCategoryOptions,
  UpdateAddonCategoryOptions,
} from "@/types/addonCategory";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "POST") {
    const { name, isRequired, menuIds } =
      req.body as CreateAddonCategoryOptions;
    const isValid = name && isRequired !== undefined && menuIds.length > 0;
    if (!isValid) return res.status(400).send("Bad request");
    const data = { name, isRequired };
    const newAddonCategory = await prisma.addonCategory.create({ data });
    const menuAddonCategoryDatas = menuIds.map((currentId) => ({
      menuId: currentId,
      addonCategoryId: newAddonCategory.id,
    }));
    const menuAddonCategories = await prisma.$transaction(
      menuAddonCategoryDatas.map(
        (menuAddonCategoryData: { menuId: number; addonCategoryId: number }) =>
          prisma.menuAddonCategory.create({ data: menuAddonCategoryData })
      )
    );
    return res.status(200).send({ newAddonCategory, menuAddonCategories });
  } else if (method === "PUT") {
    const { id, name, isRequired, menuIds } =
      req.body as UpdateAddonCategoryOptions;
    const isValid =
      id && name && isRequired !== undefined && menuIds.length > 0;
    if (!isValid) return res.status(400).send("Bad request");
    const updatedAddonCategory = await prisma.addonCategory.update({
      where: { id },
      data: { name, isRequired },
    });
    await prisma.menuAddonCategory.deleteMany({
      where: { addonCategoryId: id },
    });
    const menuAddonCategoryDatas = menuIds.map((currentId) => ({
      menuId: currentId,
      addonCategoryId: id,
    }));
    const createdMenuAddonCategories = await prisma.$transaction(
      menuAddonCategoryDatas.map(
        (data: { menuId: number; addonCategoryId: number }) =>
          prisma.menuAddonCategory.create({ data })
      )
    );
    return res
      .status(200)
      .send({ updatedAddonCategory, createdMenuAddonCategories });
  } else if (method === "DELETE") {
    const addonCategoryId = Number(req.query.id);
    if (!addonCategoryId) return res.status(400).send("Bad request");
    const addonCategoryToDelete = await prisma.addonCategory.findUnique({
      where: { id: addonCategoryId },
    });
    if (!addonCategoryToDelete) return res.status(400).send("Bad request");
    await prisma.menuAddonCategory.updateMany({
      where: { addonCategoryId },
      data: { isArchived: true },
    });
    await prisma.addon.updateMany({
      where: { addonCategoryId },
      data: { isArchived: true },
    });
    await prisma.addonCategory.update({
      where: { id: addonCategoryId },
      data: { isArchived: true },
    });
    return res.status(200).json("Deleted");
  }
  res.status(405).json("Invalid method");
}
