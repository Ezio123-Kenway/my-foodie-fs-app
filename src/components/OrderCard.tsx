import { useAppSelector } from "@/store/hooks";
import { OrderItem } from "@/types/order";
import { Box, Card, MenuItem, Select, Typography } from "@mui/material";
import { AddonCategory, OrderStatus } from "@prisma/client";

interface Props {
  orderItem: OrderItem;
  isAdmin: boolean;
  handleOrderStatusUpdate?: (itemId: string, status: OrderStatus) => void;
}

export const OrderCard = ({
  orderItem,
  isAdmin,
  handleOrderStatusUpdate,
}: Props) => {
  const addonCategories = useAppSelector((state) => state.addonCategory.items);

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 280,
          height: 280,
          mt: 2,
          mr: 3,
        }}
      >
        <Box
          sx={{
            px: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 40,
            backgroundColor: "#4C4C6D",
            color: "white",
          }}
        >
          <Typography>{orderItem.menu.name}</Typography>
          <Typography>{orderItem.table.name}</Typography>
        </Box>
        <Box sx={{ px: 2 }}>
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
          <Box sx={{ height: 250 * 0.6, overflow: "scroll" }}>
            {orderItem.orderAddons.length ? (
              orderItem.orderAddons.map((orderAddon) => {
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
              })
            ) : (
              <Typography sx={{ fontWeight: "bold" }}>
                No Selected Addon
              </Typography>
            )}
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
              <Select
                sx={{ height: 30 }}
                value={orderItem.status}
                label="Status"
                onChange={(evt) => {
                  handleOrderStatusUpdate &&
                    handleOrderStatusUpdate(
                      orderItem.itemId,
                      evt.target.value as OrderStatus
                    );
                }}
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
            ) : (
              <Typography>{orderItem.status}</Typography>
            )}
          </Box>
        </Box>
      </Card>
    </Box>
  );
};
