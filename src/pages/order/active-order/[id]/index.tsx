import { OrderCard } from "@/components/OrderCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { refreshOrder } from "@/store/slices/orderSlice";
import { formatOrders } from "@/utils/generals";
import { Box, Typography } from "@mui/material";
import { Order } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ActiveOrder = () => {
  const router = useRouter();
  const orderSeq = router.query.id;
  const orders = useAppSelector((state) => state.order.items);
  const addons = useAppSelector((state) => state.addon.items);
  const menus = useAppSelector((state) => state.menu.items);
  const tables = useAppSelector((state) => state.table.items);
  const orderItems = formatOrders(orders, addons, menus, tables);
  const dispatch = useAppDispatch();
  let intervalId: number;

  useEffect(() => {
    if (orderSeq) {
      intervalId = window.setInterval(handleRefreshOrder, 3000);
    }
    return () => {
      window.clearInterval(intervalId);
    };
  }, [orderSeq]);

  const handleRefreshOrder = () => {
    dispatch(refreshOrder({ orderSeq: String(orderSeq) }));
  };

  const getOrderTotalPrice = (orders: Order[]) => {
    const itemIds: string[] = [];
    orders.forEach((order) => {
      const exist = itemIds.find((itemId) => itemId === order.itemId);
      if (!exist) itemIds.push(order.itemId);
    });
    let orderTotalPrice = 0;
    itemIds.forEach((itemId) => {
      const totalPrice = orders.filter((order) => order.itemId === itemId)[0]
        .totalPrice;
      orderTotalPrice += totalPrice;
    });
    return orderTotalPrice;
  };

  if (!orders.length) return null;

  return (
    <Box
      sx={{
        position: "relative",
        top: 150,
        zIndex: 5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          bgcolor: "#E8F6EF",
          borderRadius: 15,
          mx: 3,
        }}
      >
        <Typography sx={{ fontWeight: "bold" }} variant="h6">
          OrderSeq: {orderSeq}
        </Typography>
        <Typography sx={{ fontWeight: "bold" }} variant="h6">
          TotalPrice: {getOrderTotalPrice(orders)}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {orderItems.map((orderItem) => {
          return (
            <OrderCard
              key={orderItem.itemId}
              orderItem={orderItem}
              isAdmin={false}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default ActiveOrder;
