import { ItemCard } from "@/components/ItemCard";
import { NewMenu } from "@/components/NewMenu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getMenus } from "@/store/slices/menuSlice";
import { Box, Button } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LocalDiningIcon from "@mui/icons-material/LocalDining";

const MenusPage = () => {
  const { data } = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const menus = useAppSelector((state) => state.menu.items);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      dispatch(getMenus());
    }
  }, [data]);

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
          <ItemCard
            key={menu.id}
            title={menu.name}
            icon={<LocalDiningIcon />}
          />
        ))}
      </Box>
      <NewMenu open={open} setOpen={setOpen} />
    </Box>
  );
};

export default MenusPage;
