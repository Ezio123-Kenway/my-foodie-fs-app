import { OrderCard } from "@/components/OrderCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatOrders } from "@/utils/generals";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { OrderStatus } from "@prisma/client";
import { updateOrder } from "../../../store/slices/orderSlice";
import { useEffect, useState } from "react";
import { OrderItem } from "@/types/order";

const OrdersPage = () => {
  const orders = useAppSelector((state) => state.order.items);
  const addons = useAppSelector((state) => state.addon.items);
  const menus = useAppSelector((state) => state.menu.items);
  const tables = useAppSelector((state) => state.table.items);
  const dispatch = useAppDispatch();
  const [value, setValue] = useState<OrderStatus>(OrderStatus.PENDING);
  const [filteredOrderItems, setFilteredOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (value && orders.length) {
      const orderItems = formatOrders(orders, addons, menus, tables);
      setFilteredOrderItems(
        orderItems.filter((orderItem) => orderItem.status === value)
      );
    }
  }, [value, orders]);

  const handleOrderStatusUpdate = (itemId: string, status: OrderStatus) => {
    dispatch(updateOrder({ itemId, status }));
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", sm: "flex-end" },
        }}
      >
        <ToggleButtonGroup
          color="primary"
          value={value}
          onChange={(evt, value) => setValue(value)}
          exclusive
        >
          <ToggleButton value={OrderStatus.PENDING}>
            {OrderStatus.PENDING}
          </ToggleButton>
          <ToggleButton value={OrderStatus.COOKING}>
            {OrderStatus.COOKING}
          </ToggleButton>
          <ToggleButton value={OrderStatus.COMPLETE}>
            {OrderStatus.COMPLETE}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        {filteredOrderItems.length &&
          filteredOrderItems.map((orderItem) => {
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
    </Box>
  );
};

export default OrdersPage;
