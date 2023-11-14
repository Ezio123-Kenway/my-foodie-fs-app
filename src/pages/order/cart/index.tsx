import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeFromCart } from "@/store/slices/cartSlice";
import { CartItem } from "@/types/cart";
import { getCartTotalPrice } from "@/utils/generals";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Avatar, Box, Button, Divider, Typography } from "@mui/material";
import { Addon } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Cart = () => {
  const cartItems = useAppSelector((state) => state.cart.items);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!cartItems.length)
      router.push({ pathname: "/order", query: router.query });
  }, [cartItems]);

  const renderAddons = (addons: Addon[]) => {
    if (!addons.length) return;
    return addons.map((item) => {
      return (
        <Box
          key={item.id}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography color={"primary"} sx={{ fontStyle: "italic" }}>
            {item.name}
          </Typography>
          <Typography color={"primary"} sx={{ fontStyle: "italic" }}>
            {item.price}
          </Typography>
        </Box>
      );
    });
  };

  const handleRemoveFromCart = (cartItem: CartItem) => {
    dispatch(removeFromCart(cartItem));
  };

  const confirmOrder = async () => {
    /* const { locationId, tableId } = query;
    const isValid = locationId && tableId && cartItems.length;
    if (!isValid) return alert("Required locationId and tableId");
    const response = await fetch(
      `${config.apiBaseUrl}/app?locationId=${locationId}&tableId=${tableId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems }),
      }
    );
    const orderCreated = await response.json();
    dispatch(addOrder(orderCreated));
    router.push({ pathname: `/order/activeOrder/${orderCreated.id}`, query }); */
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        p: 3,
        bgcolor: "#E8F6EF",
        borderRadius: 15,
        mx: 3,
        position: "relative",
        top: 150,
        zIndex: 5,
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "500px" },
        }}
      >
        <Typography
          color={"primary"}
          variant="h4"
          sx={{ textAlign: "center", mb: 3 }}
        >
          Review your order
        </Typography>
        {cartItems.map((cartItem) => {
          const { menu, addons, quantity } = cartItem;
          return (
            <Box key={cartItem.id}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    width: 25,
                    height: 25,
                    mr: 1,
                    backgroundColor: "#1B9C85",
                  }}
                >
                  {quantity}
                </Avatar>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography variant="h6" color={"primary"}>
                    {menu.name}
                  </Typography>
                  <Typography variant="h6" color={"primary"}>
                    {menu.price}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ pl: 6 }}>{renderAddons(addons)}</Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mb: 3,
                  mt: 1,
                }}
              >
                <DeleteIcon
                  color="primary"
                  sx={{ mr: 2, cursor: "pointer" }}
                  onClick={() => handleRemoveFromCart(cartItem)}
                />
                <EditIcon
                  color="primary"
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    router.push({
                      pathname: `menus/${menu.id}`,
                      query: { ...router.query, cartItemId: cartItem.id },
                    })
                  }
                />
              </Box>
            </Box>
          );
        })}
        <Divider />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Typography variant="h4" color="primary">
            Total: {getCartTotalPrice(cartItems)}
          </Typography>
        </Box>
        <Box sx={{ mt: 3, textAlign: "center" }} onClick={confirmOrder}>
          <Button disabled variant="contained">
            Confirm order
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Cart;
