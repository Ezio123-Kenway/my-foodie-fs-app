import { CartItem } from "@/types/cart";
import { OrderAddon, OrderItem } from "@/types/order";
import { Addon, Menu, Order, Table } from "@prisma/client";

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

export const formatOrders = (
  orders: Order[],
  addons: Addon[],
  menus: Menu[],
  tables: Table[]
) => {
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
        (item) => item.addonCategoryId === addon.addonCategoryId
      );
      if (exist) {
        orderAddons = orderAddons.map((orderAddon) =>
          orderAddon.addonCategoryId === addon.addonCategoryId
            ? {
                ...orderAddon,
                addons: [...orderAddon.addons, addon].sort((a, b) =>
                  a.name.localeCompare(b.name)
                ),
              }
            : orderAddon
        );
      } else {
        orderAddons.push({
          addonCategoryId: addon.addonCategoryId,
          addons: [addon].sort((a, b) => a.name.localeCompare(b.name)),
        });
      }
    });
    return {
      itemId,
      status: relatedOrders[0].status,
      orderAddons: orderAddons.sort(
        (a, b) => a.addonCategoryId - b.addonCategoryId
      ),
      menu: menus.find((item) => item.id === relatedOrders[0].menuId) as Menu,
      table: tables.find(
        (item) => item.id === relatedOrders[0].tableId
      ) as Table,
    };
  });
  return orderItems.sort((a, b) => a.itemId.localeCompare(b.itemId));
};
