import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "POST") {
    const { name, price, addonCategoryId } = req.body;
    const isValid = name && price !== undefined && addonCategoryId;
    if (!isValid) return res.status(400).send("Bad request");
    const data = { name, price, addonCategoryId };
    const newAddon = await prisma.addon.create({ data });
    return res.status(200).json({ newAddon });
  } else if (method === "PUT") {
    const { id, name, price, addonCategoryId } = req.body;
    const isValid = id && name && price !== undefined && addonCategoryId;
    if (!isValid) return res.status(400).send("Bad request");
    const updatedAddon = await prisma.addon.update({
      where: { id },
      data: { name, price, addonCategoryId },
    });
    return res.status(200).json({ updatedAddon });
  } else if (method === "DELETE") {
    const addonId = Number(req.query.id);
    if (!addonId) return res.status(400).send("Bad request");
    const addonToUpdate = await prisma.addon.findUnique({
      where: { id: addonId },
    });
    if (!addonToUpdate) return res.status(400).send("Bad request");
    await prisma.addon.update({
      where: { id: addonId },
      data: { isArchived: true },
    });
    return res.status(200).json("Deleted");
  }
  res.status(405).json("Invalid method");
}
