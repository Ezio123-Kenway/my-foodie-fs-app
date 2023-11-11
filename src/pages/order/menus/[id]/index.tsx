import { AddonCategories } from "@/components/AddonCategories";
import { QuantitySelector } from "@/components/QuantitySelector";
import { useAppSelector } from "@/store/hooks";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";

const MenuDetailPage = () => {
  const { query, isReady } = useRouter();
  const menuId = Number(query.id);
  const menus = useAppSelector((state) => state.menu.items);
  const menu = menus.find((item) => item.id === menuId);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedAddonIds, setSelectedAddonIds] = useState<number[]>([]);

  const handleDecreaseQuantity = () => {
    setQuantity(quantity - 1 === 0 ? 1 : quantity - 1);
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  if (!menu || !isReady) return null;

  return (
    <Box>
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
            menuId={menuId}
            selectedAddonIds={selectedAddonIds}
            setSelectedAddonIds={setSelectedAddonIds}
          />
          <QuantitySelector
            quantity={quantity}
            handleDecreaseQuantity={handleDecreaseQuantity}
            handleIncreaseQuantity={handleIncreaseQuantity}
          />
          {/* <Button
            variant="contained"
            disabled={isDisabled}
            onClick={handleAddToCart}
            sx={{
              width: "fit-content",
              mt: 3,
            }}
          >
            Add to cart
          </Button> */}
        </Box>
      </Box>
    </Box>
  );
};

export default MenuDetailPage;
