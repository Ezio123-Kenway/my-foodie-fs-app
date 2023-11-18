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
  if (method === "POST") {
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
    const orders = await prisma.order.findMany({ where: { orderSeq } });
    return res.status(200).json({ orders });
  } else if (method === "PUT") {
    const itemId = req.query.itemId;
    const status = req.body.status as OrderStatus;
    const isValid = itemId && status;
    if (!isValid) return res.status(400).send("Bad request");
    const orderToUpdate = await prisma.order.findFirst({
      where: { itemId: String(itemId) },
    });
    if (!orderToUpdate) return res.status(400).send("Bad request");
    const orderSeq = orderToUpdate.orderSeq;
    await prisma.order.updateMany({
      where: { itemId: String(itemId) },
      data: { status },
    });

    const orders = await prisma.order.findMany({ where: { orderSeq } });
    return res.status(200).json({ orders });
  }
  res.status(405).send("Invalid method..");
}
