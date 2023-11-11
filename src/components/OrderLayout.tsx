import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import OrderAppHeader from "./OrderAppHeader";

interface Props {
  children: string | JSX.Element | JSX.Element[];
}

const OrderLayout = ({ children }: Props) => {
  const router = useRouter();
  const { companyId, tableId } = router.query;
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const isHome = router.pathname === "/order";

  useEffect(() => {
    if (companyId && tableId) {
      dispatch(
        fetchAppData({ companyId: Number(companyId), tableId: Number(tableId) })
      );
    }
  }, [companyId, tableId]);

  return (
    <Box>
      <OrderAppHeader cartItemCount={items.length} />
      <Box
        sx={{
          position: "relative",
          zIndex: 5,
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
