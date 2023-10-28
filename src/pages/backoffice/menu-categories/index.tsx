import { NewMenuCategory } from "@/components/NewMenuCategory";
import { useAppSelector } from "@/store/hooks";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import CategoryIcon from "@mui/icons-material/Category";
import { ItemCard } from "@/components/ItemCard";

const MenuCategoriesPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const menuCategories = useAppSelector((state) => state.menuCategory.items);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          sx={{ width: "fit-content" }}
          onClick={() => setOpen(true)}
        >
          Create menu category
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {menuCategories.map((menuCategory) => (
          <ItemCard
            href={`/backoffice/menu-categories/${menuCategory.id}`}
            key={menuCategory.id}
            title={menuCategory.name}
            icon={<CategoryIcon />}
          />
        ))}
      </Box>
      <NewMenuCategory open={open} setOpen={setOpen} />
    </Box>
  );
};

export default MenuCategoriesPage;
