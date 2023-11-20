import { OrderCard } from "@/components/OrderCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatOrders } from "@/utils/generals";
import { Box } from "@mui/material";
import { OrderStatus } from "@prisma/client";
import { updateOrder } from "../../../store/slices/orderSlice";

const OrdersPage = () => {
  const orders = useAppSelector((state) => state.order.items);
  const addons = useAppSelector((state) => state.addon.items);
  const orderItems = formatOrders(orders, addons);
  const dispatch = useAppDispatch();

  const handleOrderStatusUpdate = (itemId: string, status: OrderStatus) => {
    dispatch(updateOrder({ itemId, status }));
  };

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
      {orderItems.map((orderItem) => {
        return (
          <OrderCard
            key={orderItem.itemId}
            orderItem={orderItem}
            isAdmin
            handleOrderStatusUpdate={handleOrderStatusUpdate}
          />
        );
      })}
    </Box>
  );
};

export default OrdersPage;
