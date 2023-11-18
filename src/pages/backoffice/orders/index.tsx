import { OrderCard } from "@/components/OrderCard";
import { useAppSelector } from "@/store/hooks";
import { formatOrders } from "@/utils/generals";
import { Box } from "@mui/material";

const OrdersPage = () => {
  const orders = useAppSelector((state) => state.order.items);
  const addons = useAppSelector((state) => state.addon.items);
  const orderItems = formatOrders(orders, addons);

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
      {orderItems.map((orderItem) => {
        return (
          <OrderCard
            key={orderItem.itemId}
            orderItem={orderItem}
            isAdmin={true}
          />
        );
      })}
    </Box>
  );
};

export default OrdersPage;
