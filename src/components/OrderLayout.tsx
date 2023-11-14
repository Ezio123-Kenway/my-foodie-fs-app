import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import OrderAppHeader from "./OrderAppHeader";
import { CartItem } from "@/types/cart";

interface Props {
  children: string | JSX.Element | JSX.Element[];
}

const OrderLayout = ({ children }: Props) => {
  const router = useRouter();
  const { tableId } = router.query;
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const isHome = router.pathname === "/order";

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
    </Box>
  );
};

export default OrderLayout;
