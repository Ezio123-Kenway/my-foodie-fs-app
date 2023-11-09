import { useAppDispatch } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import OrderAppHeader from "./OrderAppHeader";

interface Props {
  children: string | JSX.Element | JSX.Element[];
}

export const OrderLayout = ({ children }: Props) => {
  const router = useRouter();
  console.log("routerQuery: ", router.query);
  const { companyId, tableId } = router.query;
  const dispatch = useAppDispatch();
  const isHome = router.pathname === "/order";
  console.log("isHome: ", isHome);

  useEffect(() => {
    if (companyId && tableId) {
      dispatch(
        fetchAppData({ companyId: Number(companyId), tableId: Number(tableId) })
      );
    }
  }, [companyId, tableId]);

  return (
    <Box>
      <OrderAppHeader cartItemCount={1} />
      <Box sx={{ position: "relative", zIndex: 5, top: isHome ? 240 : 0 }}>
        <Box sx={{ width: { xs: "100%", md: "80%", lg: "55%" }, m: "0 auto" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
