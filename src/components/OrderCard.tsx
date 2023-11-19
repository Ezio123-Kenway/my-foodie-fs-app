import { useAppSelector } from "@/store/hooks";
import { OrderItem } from "@/types/order";
import { Box, Card, MenuItem, Select, Typography } from "@mui/material";
import { AddonCategory, OrderStatus } from "@prisma/client";

interface Props {
  orderItem: OrderItem;
  isAdmin: boolean;
}

export const OrderCard = ({ orderItem, isAdmin }: Props) => {
  const addonCategories = useAppSelector((state) => state.addonCategory.items);

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
          <Typography sx={{ fontWeight: "bold" }}>itemId:</Typography>
          <Typography>{orderItem.itemId}</Typography>
        </Box>
        <Box sx={{ height: 250 * 0.6, scroll: "flow" }}>
          {orderItem.orderAddons.map((orderAddon) => {
            const addonCategory = addonCategories.find(
              (item) => item.id === orderAddon.addonCategoryId
            ) as AddonCategory;

            return (
              <Box sx={{ mb: 3 }} key={orderAddon.addonCategoryId}>
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
            <Select sx={{ height: 30 }} value={orderItem.status} label="Status">
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
          ) : (
            <Typography>{orderItem.status}</Typography>
          )}
        </Box>
      </Card>
    </Box>
  );
};
