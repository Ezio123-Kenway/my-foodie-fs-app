import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import {
  CreateAddOnCategoryOptions,
  DeleteAddOnCategoryOptions,
  UpdateAddOnCategoryOptions,
} from "@/types/addonCategory";
import { prisma } from "@/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).send("Unauthorized");
  const method = req.method;
  if (method === "POST") {
    const { name, isRequired, menuIds } =
      req.body as CreateAddOnCategoryOptions;
    const isValid = name && isRequired !== undefined && menuIds.length > 0;
    if (!isValid) return res.status(400).send("Bad request");
    const newAddonCategory = await prisma.addonCategory.create({
      data: { name, isRequired },
    });
    const menuAddonCategoriesData: {
      menuId: number;
      addonCategoryId: number;
    }[] = menuIds.map((selectedId) => ({
      menuId: selectedId,
      addonCategoryId: newAddonCategory.id,
    }));
    const newMenuAddonCategories = await prisma.$transaction(
      menuAddonCategoriesData.map((data) =>
        prisma.menuAddonCategory.create({ data })
      )
    );
    return res.status(200).send({ newAddonCategory, newMenuAddonCategories });
  } else if (method === "PUT") {
    const { id, name, isRequired, menuIds } =
      req.body as UpdateAddOnCategoryOptions;
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
    const menuAddonCategoriesData: {
      menuId: number;
      addonCategoryId: number;
    }[] = menuIds.map((selectedId) => ({
      menuId: selectedId,
      addonCategoryId: id,
    }));
    const createdMenuAddonCategories = await prisma.$transaction(
      menuAddonCategoriesData.map((data) =>
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
    await prisma.addonCategory.update({
      where: { id: addonCategoryId },
      data: { isArchived: true },
    });
    return res.status(200).send("Deleted");
  }

  res.status(405).json("Invalid method");
}
