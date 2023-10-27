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
  if (method === "POST") {
    const { name, locationId } = req.body;
    const isValid = name && locationId;
    if (!isValid) return res.status(400).send("Bad request");
    const newTable = await prisma.table.create({ data: { name, locationId } });
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
