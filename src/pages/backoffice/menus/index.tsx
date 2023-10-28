import { NewMenu } from "@/components/NewMenu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getMenus } from "@/store/slices/menuSlice";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import { ItemCard } from "@/components/ItemCard";

const MenusPage = () => {
  const { data } = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const menus = useAppSelector((state) => state.menu.items);
  console.log("menus: ", menus);
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
          <Link
            href={`menus/${menu.id}`}
            key={menu.id}
            style={{ textDecoration: "none" }}
          >
            <ItemCard icon={<LocalDiningIcon />} title={menu.name} />
          </Link>
        ))}
      </Box>
      <NewMenu open={open} setOpen={setOpen} />
    </Box>
  );
};

export default MenusPage;
