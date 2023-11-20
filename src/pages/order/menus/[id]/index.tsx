import { AddonCategories } from "@/components/AddonCategories";
import { QuantitySelector } from "@/components/QuantitySelector";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Addon, AddonCategory } from "@prisma/client";
import { CartItem } from "@/types/cart";
import { addToCart, updateQuantityInCart } from "@/store/slices/cartSlice";
import { nanoid } from "nanoid";

const MenuDetailPage = () => {
  const { query, isReady, ...router } = useRouter();
  const menuId = Number(query.id);
  const menus = useAppSelector((state) => state.menu.items);
  const menu = menus.find((item) => item.id === menuId);
  const cartItemId = query.cartItemId;
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItem = cartItems.find((item) => item.id === cartItemId);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const menuAddonCategories = useAppSelector(
    (state) => state.menuAddonCategory.items
  );

  const relatedAddonCategoryIds = menuAddonCategories
    .filter((item) => item.menuId === menuId)
    .map((element) => element.addonCategoryId);

  const relatedAddonCategories = useAppSelector(
    (state) => state.addonCategory.items
  ).filter((item) => relatedAddonCategoryIds.includes(item.id));

  useEffect(() => {
    const requiredAddonCategories = relatedAddonCategories.filter(
      (item) => item.isRequired
    );
    const selectedRequiredAddons = selectedAddons.filter((selectedAddon) => {
      const addonCategory = requiredAddonCategories.find(
        (item) => item.id === selectedAddon.addonCategoryId
      );
      return addonCategory?.isRequired;
    });
    const isDisabled = !(
      selectedRequiredAddons.length === requiredAddonCategories.length
    );
    setIsDisabled(isDisabled);
  }, [selectedAddons, relatedAddonCategories]);

  useEffect(() => {
    if (cartItem && menu) {
      const { addons, quantity } = cartItem;
      setSelectedAddons(addons);
      setQuantity(quantity);
    }
  }, [cartItem, menu]);

  const handleDecreaseQuantity = () => {
    setQuantity(quantity - 1 === 0 ? 1 : quantity - 1);
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleSameCartItem = (menuId: number, selectedAddons: Addon[]) => {
    const sameMenuItems = cartItems.filter((item) => item.menu.id === menuId);
    if (!sameMenuItems.length) return;
    const sameCartItem = sameMenuItems.find((menuItem) => {
      if (selectedAddons.length !== menuItem.addons.length) return;
      // we will use array every method..
      return selectedAddons.every((selectedAddon) =>
        menuItem.addons.includes(selectedAddon)
      );
    });
    if (!sameCartItem) return;
    return { id: sameCartItem.id, quantity };
  };

  const handleUpdateQuantity = () => {
    const exist = handleSameCartItem(menuId, selectedAddons);
    if (exist) {
      dispatch(updateQuantityInCart(exist));
      router.push({ pathname: "/order", query });
    }
  };

  const handleAddToCart = () => {
    if (!menu) return;
    const newCartItem: CartItem = {
      id: cartItem ? cartItem.id : nanoid(7),
      menu,
      addons: selectedAddons,
      quantity,
    };
    dispatch(addToCart(newCartItem));
    const pathname = cartItem ? "/order/cart" : "/order";
    router.push({ pathname, query });
  };

  if (!menu || !isReady) return null;

  return (
    <Box sx={{ position: "relative", zIndex: 5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          p: 4,
        }}
      >
        <Image
          src={menu.imageUrl || "/default-menu.png"}
          alt="menu-image"
          width={150}
          height={150}
          style={{
            borderRadius: "50%",
            margin: "0 auto",
          }}
        />
        <Box
          sx={{
            mt: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <AddonCategories
            relatedAddonCategories={relatedAddonCategories}
            selectedAddons={selectedAddons}
            setSelectedAddons={setSelectedAddons}
          />
          <QuantitySelector
            quantity={quantity}
            handleDecreaseQuantity={handleDecreaseQuantity}
            handleIncreaseQuantity={handleIncreaseQuantity}
          />
          <Button
            variant="contained"
            disabled={isDisabled}
            onClick={() => {
              !handleSameCartItem(menuId, selectedAddons) || cartItemId
                ? handleAddToCart()
                : handleUpdateQuantity();
            }}
            sx={{
              width: "fit-content",
              mt: 3,
            }}
          >
            {cartItem ? "Update cart" : "Add to cart"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MenuDetailPage;
