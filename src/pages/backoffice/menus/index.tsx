import { NewMenu } from "@/components/NewMenu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getMenus } from "@/store/slices/menuSlice";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
          <Link
            href={`menus/${menu.id}`}
            key={menu.id}
            style={{ textDecoration: "none" }}
          >
            <Paper elevation={3} sx={{ width: 150, height: 150, m: 2 }}>
              <Typography variant="h6">{menu.name}</Typography>
              <Typography variant="h6">{menu.price}</Typography>
            </Paper>
          </Link>
        ))}
      </Box>
      <NewMenu open={open} setOpen={setOpen} />
    </Box>
  );
};

export default MenusPage;
