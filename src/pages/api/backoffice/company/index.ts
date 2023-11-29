import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "PUT") {
    const { id, name, street, township, city } = req.body;
    const isValid = id && name && street && township && city;
    if (!isValid) return res.status(400).send("Bad request");
    const companyToUpdate = await prisma.company.findUnique({ where: { id } });
    if (!companyToUpdate) return res.status(400).send("Bad request");
    const updatedCompany = await prisma.company.update({
      where: { id },
      data: { name, street, township, city },
    });
    return res.status(200).json({ updatedCompany });
  }
  res.status(405).send("Invalid method");
}
