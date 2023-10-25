import { DeleteMenu } from "@/components/DeleteMenu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Box, Button, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

const MenuDetailPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const menuId = Number(router.query.id);
  const menus = useAppSelector((state) => state.menu.items);
  const dispatch = useAppDispatch();
  const menu = menus.find((menu) => menu.id === menuId);
  if (!menu) return null;

  const defaultUpdatedMenu = {
    name: menu.name as string,
    price: menu.price as number,
  };

  const [updatedMenu, setUpdatedMenu] = useState();

  // const handleUpdateMenu = () => {
  //   dispatch(updateMenuThunk({ ...updatedMenu, id: menuId }));
  //   router.push("/backoffice/menus");
  // };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Delete
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          variant="outlined"
          sx={{ width: "100%" }}
          defaultValue={defaultUpdatedMenu.name}
        ></TextField>
        <TextField
          variant="outlined"
          sx={{ width: "100%", my: 3 }}
          defaultValue={defaultUpdatedMenu.price}
        ></TextField>
        <Button variant="contained" color="primary" disabled={true}>
          Update
        </Button>
        <DeleteMenu open={open} setOpen={setOpen} menuId={menuId} />
      </Box>
    </Box>
  );
};

export default MenuDetailPage;
