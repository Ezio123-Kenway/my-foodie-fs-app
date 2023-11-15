import { AddonCategories } from "@/components/AddonCategories";
import { QuantitySelector } from "@/components/QuantitySelector";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Addon, AddonCategory } from "@prisma/client";
import { CartItem } from "@/types/cart";
import { generateRandomId } from "@/utils/generals";
import { addToCart } from "@/store/slices/cartSlice";

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
      if (cartItem.menu.id === menu.id) {
        const { addons, quantity } = cartItem;
        setSelectedAddons(addons);
        setQuantity(quantity);
      } else {
        setSelectedAddons([]);
        setQuantity(1);
      }
    }
  }, [cartItem, menu]);

  const handleDecreaseQuantity = () => {
    setQuantity(quantity - 1 === 0 ? 1 : quantity - 1);
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleSameCartItem = (menuId: number, selectedAddons: Addon[]) => {
    if (cartItemId) return;
    const sameMenuItems = cartItems.filter((item) => item.menu.id === menuId);
    if (!sameMenuItems.length) return;
    const sameCartItem = sameMenuItems.find((item) => {
      const currentAddons = selectedAddons.filter((addon) =>
        item.addons.includes(addon)
      );
      return currentAddons.length === selectedAddons.length ? true : false;
    });
    if (!sameCartItem) return;
    return { id: sameCartItem.id, currentQuantity: sameCartItem.quantity };
  };

  const handleAddToCart = () => {
    if (!menu) return;

    const item = handleSameCartItem(menuId, selectedAddons);
    console.log("item: ", item);

    const newCartItem: CartItem = item
      ? {
          id: item.id,
          menu,
          addons: selectedAddons,
          quantity: item.currentQuantity + quantity,
        }
      : {
          id:
            cartItem && cartItem.menu.id === menu.id
              ? cartItem.id
              : generateRandomId(),
          menu,
          addons: selectedAddons,
          quantity,
        };
    dispatch(addToCart(newCartItem));
    const pathname =
      cartItem && cartItem.menu.id === menu.id ? "/order/cart" : "/order";
    const queryWithCartItemId = { ...query, cartItemId };
    const { cartItemId: itemId, ...queryWithoutCartItemId } = query;
    router.push({
      pathname,
      query:
        cartItem && cartItem.menu.id === menu.id
          ? queryWithCartItemId
          : queryWithoutCartItemId,
    });
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
            onClick={handleAddToCart}
            sx={{
              width: "fit-content",
              mt: 3,
            }}
          >
            {cartItem && cartItem.menu.id === menu.id
              ? "Update cart"
              : "Add to cart"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MenuDetailPage;
