import { CartItem } from "@/types/cart";
import { prisma } from "@/utils/db";
import { getCartTotalPrice } from "@/utils/generals";
import { OrderStatus } from "@prisma/client";
import { nanoid } from "nanoid";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "GET") {
    const orderSeq = req.query.orderSeq;
    const isValid = orderSeq;
    if (!isValid) return res.status(400).send("Bad request");
    const orders = await prisma.order.findMany({
      where: { orderSeq: String(orderSeq) },
    });
    if (!orders.length) return res.status(400).send("Bad request");

    return res.status(200).json({ orders });
  } else if (method === "POST") {
    const { tableId, cartItems } = req.body;
    const isValid = tableId && cartItems.length;
    if (!isValid) return res.status(400).send("Bad request");
    const order = await prisma.order.findFirst({
      where: {
        tableId,
        status: { in: [OrderStatus.PENDING, OrderStatus.COOKING] },
      },
    });
    const orderSeq = order ? order.orderSeq : nanoid();
    for (const item of cartItems) {
      const cartItem = item as CartItem;
      const hasAddons = cartItem.addons.length > 0;
      if (hasAddons) {
        for (const addon of cartItem.addons) {
          await prisma.order.create({
            data: {
              menuId: cartItem.menu.id,
              addonId: addon.id,
              quantity: cartItem.quantity,
              orderSeq,
              itemId: cartItem.id,
              status: OrderStatus.PENDING,
              totalPrice: getCartTotalPrice(cartItems),
              tableId,
            },
          });
        }
      } else {
        await prisma.order.create({
          data: {
            menuId: cartItem.menu.id,
            quantity: cartItem.quantity,
            orderSeq,
            itemId: cartItem.id,
            status: OrderStatus.PENDING,
            totalPrice: getCartTotalPrice(cartItems),
            tableId,
          },
        });
      }
    }
    const orders = await prisma.order.findMany({
      where: { orderSeq, isArchived: false },
      orderBy: { id: "asc" },
    });
    return res.status(200).json({ orders });
  } else if (method === "PUT") {
    const itemId = req.query.itemId;
    const isValid = itemId && req.body.status;
    if (!isValid) return res.status(400).send("Bad request");
    const exist = await prisma.order.findFirst({
      where: { itemId: String(itemId) },
    });
    if (!exist) return res.status(400).send("Bad request");
    const table = await prisma.table.findUnique({
      where: { id: exist.tableId },
    });
    const location = await prisma.location.findUnique({
      where: { id: table?.locationId },
    });
    const tableIds = (
      await prisma.table.findMany({ where: { locationId: location?.id } })
    ).map((item) => item.id);
    await prisma.order.updateMany({
      where: { itemId: String(itemId) },
      data: { status: req.body.status as OrderStatus },
    });
    const orders = await prisma.order.findMany({
      where: { tableId: { in: tableIds }, isArchived: false },
      orderBy: { id: "asc" },
    });
    return res.status(200).json({ orders });
  }
  res.status(405).send("Invalid method..");
}
