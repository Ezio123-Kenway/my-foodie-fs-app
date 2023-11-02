import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/utils/db";
import { handleDeleteMenuCategory } from "../handleDelete";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).send("Unauthorized");
  // const user = session.user;
  // const email = user?.email as string;
  // const dbUser = await prisma.user.findUnique({ where: { email } });
  // if (!dbUser) return res.status(401).send("Unauthorized");
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
    // delete function
    handleDeleteMenuCategory(menuCategoryId);
    return res.status(200).json("Deleted");
  }
  res.status(405).send("Invalid method");
}
