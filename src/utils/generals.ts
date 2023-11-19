import { CartItem } from "@/types/cart";
import { OrderAddon, OrderItem } from "@/types/order";
import { Addon, Order } from "@prisma/client";

export const getCartTotalPrice = (cartItems: CartItem[]) => {
  const totalPrice = cartItems.reduce((prev, curr) => {
    const menuPrice = curr.menu.price;
    const totalAddonPrice = curr.addons.reduce(
      (addonPrice, addon) => (addonPrice += addon.price),
      0
    );
    prev += (menuPrice + totalAddonPrice) * curr.quantity;
    return prev;
  }, 0);
  return totalPrice;
};

export const formatOrders = (orders: Order[], addons: Addon[]) => {
  const itemIds: string[] = [];
  orders.forEach((order) => {
    const exist = itemIds.find((itemId) => itemId === order.itemId);
    if (!exist) itemIds.push(order.itemId);
  });
  const orderItems: OrderItem[] = itemIds.map((itemId) => {
    const relatedOrders = orders.filter((order) => order.itemId === itemId);
    const addonIds = relatedOrders.map((item) => item.addonId);
    let orderAddons: OrderAddon[] = [];
    addonIds.forEach((addonId) => {
      const addon = addons.find((element) => element.id === addonId) as Addon;
      const exist = orderAddons.find(
        (item) => item.addonCategeoryId === addon.addonCategoryId
      );
      if (exist) {
        orderAddons = orderAddons.map((orderAddon) =>
          orderAddon.addonCategeoryId === addon.addonCategoryId
            ? { ...orderAddon, addons: [...orderAddon.addons, addon] }
            : orderAddon
        );
      } else {
        orderAddons.push({
          addonCategeoryId: addon.addonCategoryId,
          addons: [addon],
        });
      }
    });
    return { itemId, status: relatedOrders[0].status, orderAddons };
  });
  return orderItems;
};
