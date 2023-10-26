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
    const { companyId } = location;
    const newMenuCategory = await prisma.menuCategory.create({
      data: { name, companyId },
    });
    return res.status(200).json(newMenuCategory);
  }
  res.status(405).send("Invalid method");
}
