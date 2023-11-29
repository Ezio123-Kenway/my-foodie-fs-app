import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "POST") {
    const { name, street, township, city, companyId } = req.body;
    const isValid = name && street && township && city && companyId;
    if (!isValid) return res.status(400).send("Bad request");
    const newLocation = await prisma.location.create({
      data: { name, street, township, city, companyId },
    });
    return res.status(200).json({ newLocation });
  } else if (method === "PUT") {
    const { id, name, street, township, city } = req.body;
    const isValid = id && name && street && township && city;
    if (!isValid) return res.status(400).send("Bad request");
    const locationToUpdate = await prisma.location.findUnique({
      where: { id },
    });
    if (!locationToUpdate) return res.status(400).send("Bad request");
    const updatedLocation = await prisma.location.update({
      where: { id },
      data: { name, street, township, city },
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
