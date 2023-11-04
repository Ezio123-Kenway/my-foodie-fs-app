import { NewMenu } from "@/components/NewMenu";
import { useAppSelector } from "@/store/hooks";
import { Box, Button, Paper, Typography } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import { ItemCard } from "@/components/ItemCard";
import MenuCard from "@/components/MenuCard";

const MenusPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const menus = useAppSelector((state) => state.menu.items);
  // console.log("menus: ", menus);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          sx={{ width: "fit-content" }}
          onClick={() => setOpen(true)}
        >
          Create menu
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {menus.map((menu) => (
          <MenuCard key={menu.id} menu={menu} href={`menus/${menu.id}`} />
        ))}
      </Box>
      <NewMenu open={open} setOpen={setOpen} />
    </Box>
  );
};

export default MenusPage;
