import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/utils/db";
import { getQrCodeUrl, qrCodeImageUpload } from "@/utils/fileUpload";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).send("Unauthorized");
  const method = req.method;
  if (method === "POST") {
    const { name, locationId } = req.body;
    const user = session.user;
    const email = user?.email as string;
    const dbUser = await prisma.user.findUnique({ where: { email } });
    const isValid = name && locationId && dbUser;
    if (!isValid) return res.status(400).send("Bad request");
    const newTable = await prisma.table.create({
      data: { name, locationId, assetUrl: "" },
    });
    const companyId = dbUser.companyId;
    const tableId = newTable.id;
    await qrCodeImageUpload(companyId, tableId);
    const assetUrl = getQrCodeUrl(companyId, tableId);
    await prisma.table.update({
      where: { id: tableId },
      data: { assetUrl },
    });
    return res.status(200).json({ newTable });
  } else if (method === "PUT") {
    const { id, name } = req.body;
    const isValid = id && name;
    if (!isValid) return res.status(400).send("Bad request");
    const tableToUpdate = await prisma.table.findUnique({ where: { id } });
    if (!tableToUpdate) return res.status(400).send("Bad request");
    const updatedTable = await prisma.table.update({
      where: { id },
      data: { name },
    });
    return res.status(200).json({ updatedTable });
  } else if (method === "DELETE") {
    const tableId = Number(req.query.id);
    if (!tableId) return res.status(400).send("Bad request");
    const tableToDelete = await prisma.table.findUnique({
      where: { id: tableId },
    });
    if (!tableToDelete) return res.status(400).send("Bad request");
    await prisma.table.update({
      where: { id: tableId },
      data: { isArchived: true },
    });
    return res.status(200).send("Deleted");
  }
  res.status(200).json({ name: "John Doe" });
}
