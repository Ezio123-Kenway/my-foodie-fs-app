import { NewMenuCategory } from "@/components/NewMenuCategory";
import { useAppSelector } from "@/store/hooks";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

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
      {menuCategories.map((menuCategory) => (
        <Typography key={menuCategory.id}>{menuCategory.name}</Typography>
      ))}
      <NewMenuCategory open={open} setOpen={setOpen} />
    </Box>
  );
};

export default MenuCategoriesPage;
