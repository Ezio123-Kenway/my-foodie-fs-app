import { NewMenu } from "@/components/NewMenu";
import { useAppSelector } from "@/store/hooks";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useState } from "react";
import MenuCard from "@/components/MenuCard";

const MenusPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const menus = useAppSelector((state) => state.menu.items);
  const disabledLocationMenus = useAppSelector(
    (state) => state.disabledLocationMenu.items
  );

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
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: { xs: "center", sm: "flex-start" },
          mt: 2,
        }}
      >
        {menus.map((menu) => {
          const exist = disabledLocationMenus.find(
            (item) =>
              item.locationId ===
                Number(localStorage.getItem("selectedLocationId")) &&
              item.menuId === menu.id
          );
          return (
            <MenuCard
              menu={menu}
              href={`menus/${menu.id}`}
              key={menu.id}
              isAvailable={!exist}
            />
          );
        })}
      </Box>
      <NewMenu open={open} setOpen={setOpen} />
    </Box>
  );
};

export default MenusPage;
