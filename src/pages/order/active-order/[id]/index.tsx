import { OrderCard } from "@/components/OrderCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateOrder } from "@/store/slices/orderSlice";
import { formatOrders } from "@/utils/generals";
import { Box } from "@mui/material";
import { OrderStatus } from "@prisma/client";
import { useRouter } from "next/router";

const ActiveOrder = () => {
  const router = useRouter();
  const orderSeq = router.query.id;
  const orders = useAppSelector((state) => state.order.items);
  const addons = useAppSelector((state) => state.addon.items);
  const orderItems = formatOrders(orders, addons);
  const dispatch = useAppDispatch();

  const handleOrderStatusUpdate = (itemId: string, status: OrderStatus) => {
    dispatch(updateOrder({ itemId, status }));
  };

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
          justifyContent: "center",
          p: 3,
          bgcolor: "#E8F6EF",
          borderRadius: 15,
          mx: 3,
        }}
      >
        OrderSeq: {orderSeq}
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {orderItems.map((orderItem) => {
          return (
            <OrderCard
              key={orderItem.itemId}
              orderItem={orderItem}
              isAdmin={false}
              handleOrderStatusUpdate={handleOrderStatusUpdate}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default ActiveOrder;
