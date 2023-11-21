import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import OrderAppHeader from "./OrderAppHeader";
import { CartItem } from "@/types/cart";
import { Order } from "@prisma/client";

interface Props {
  children: string | JSX.Element | JSX.Element[];
}

const OrderLayout = ({ children }: Props) => {
  const router = useRouter();
  const { tableId } = router.query;
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const isHome = router.pathname === "/order";
  const isActiveOrderPage = router.pathname.includes("active-order");
  const orders = useAppSelector((state) => state.order.items);

  const getTotalCount = (cartItems: CartItem[]) => {
    const totalCount = cartItems.reduce(
      (count, cartItem) => (count += cartItem.quantity),
      0
    );
    return totalCount;
  };

  useEffect(() => {
    if (tableId) {
      dispatch(fetchAppData({ tableId: Number(tableId) }));
    }
  }, [tableId]);

  return (
    <Box>
      <OrderAppHeader cartItemCount={getTotalCount(items)} />
      <Box
        sx={{
          position: "relative",
          top: isHome ? 240 : 0,
          width: "100%",
          height: "100vh",
        }}
      >
        <Box sx={{ width: { xs: "100%", md: "80%", lg: "55%" }, m: "0 auto" }}>
          {children}
        </Box>
      </Box>
      {orders.length && !isActiveOrderPage && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            width: "100vw",
            height: 50,
            backgroundColor: "primary.main",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            router.push({
              pathname: `/order/active-order/${orders[0].orderSeq}`,
              query: router.query,
            });
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "secondary.main", userSelect: "none" }}
          >
            You have active order. Click here to view.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default OrderLayout;
