import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateOrder } from "@/store/slices/orderSlice";
import { OrderItem } from "@/types/order";
import {
  Box,
  Card,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { AddonCategory, OrderStatus } from "@prisma/client";

interface Props {
  orderItem: OrderItem;
  isAdmin: boolean;
}

export const OrderCard = ({ orderItem, isAdmin }: Props) => {
  const addonCategories = useAppSelector((state) => state.addonCategory.items);
  const dispatch = useAppDispatch();

  const handleOrderStatusUpdate = (
    evt: SelectChangeEvent<"PENDING" | "COOKING" | "COMPLETE">
  ) => {
    const status = evt.target.value as OrderStatus;
    console.log("status: ", status);
    dispatch(updateOrder({ itemId: orderItem.itemId, status }));
  };

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 250,
          height: 250,
          py: 1,
          px: 2,
          mt: 2,
          mr: 2,
        }}
      >
        <Box
          sx={{
            height: 250 * 0.15,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid lightgray",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>ItemId:</Typography>
          <Typography>{orderItem.itemId}</Typography>
        </Box>
        <Box sx={{ height: 250 * 0.6, overflow: "scroll" }}>
          {orderItem.orderAddons.map((orderAddon) => {
            const addonCategory = addonCategories.find(
              (innerItem) => innerItem.id === orderAddon.addonCategoryId
            ) as AddonCategory;

            return (
              <Box key={orderAddon.addonCategoryId} sx={{ mb: 3 }}>
                <Typography>{addonCategory.name}</Typography>
                {orderAddon.addons.map((addon) => {
                  return (
                    <Typography
                      key={addon.id}
                      sx={{
                        fontSize: 14,
                        fontWeight: "bold",
                        fontStyle: "italic",
                        ml: 2,
                      }}
                    >
                      {addon.name}
                    </Typography>
                  );
                })}
              </Box>
            );
          })}
        </Box>
        <Box
          sx={{
            height: 250 * 0.15,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid lightgray",
            pt: 1,
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>Status:</Typography>
          {isAdmin ? (
            <>
              <Select
                value={orderItem.status}
                label="Status"
                sx={{ height: 30 }}
                onChange={handleOrderStatusUpdate}
              >
                <MenuItem value={OrderStatus.PENDING}>
                  {OrderStatus.PENDING}
                </MenuItem>
                <MenuItem value={OrderStatus.COOKING}>
                  {OrderStatus.COOKING}
                </MenuItem>
                <MenuItem value={OrderStatus.COMPLETE}>
                  {OrderStatus.COMPLETE}
                </MenuItem>
              </Select>
            </>
          ) : (
            <Typography>{orderItem.status}</Typography>
          )}
        </Box>
      </Card>
    </Box>
  );
};
