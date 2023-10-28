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
  const method = req.method;
  const user = session.user;
  const email = user?.email as string;
  const dbUser = await prisma.user.findUnique({ where: { email } });
  if (!dbUser) return res.status(401).send("Unauthorized");
  const companyId = dbUser.companyId;
  if (method === "POST") {
    const { name, address } = req.body;
    const isValid = name && address;
    if (!isValid) return res.status(400).send("Bad request");
    const newLocation = await prisma.location.create({
      data: { name, address, companyId },
    });
    return res.status(200).json({ newLocation });
  } else if (method === "PUT") {
    const { id, name, address } = req.body;
    const isValid = id && name && address;
    if (!isValid) return res.status(400).send("Bad request");
    const locationToUpdate = await prisma.location.findUnique({
      where: { id },
    });
    if (!locationToUpdate) return res.status(400).send("Bad request");
    const updatedLocation = await prisma.location.update({
      where: { id },
      data: { name, address },
    });
    return res.status(200).json({ updatedLocation });
  } else if (method === "DELETE") {
    const locationId = Number(req.query.id);
    if (!locationId) return res.status(400).send("Bad request");
    const locationToDelete = await prisma.location.findUnique({
      where: { id: locationId },
    });
    if (!locationToDelete) return res.status(400).send("Bad request");
    await prisma.location.update({
      where: { id: locationId },
      data: { isArchived: true },
    });
    return res.status(200).json("Deleted");
  }
  res.status(200).json({ name: "John Doe" });
}
