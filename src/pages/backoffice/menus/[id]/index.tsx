import { DeleteMenu } from "@/components/DeleteMenu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateMenu } from "@/store/slices/menuSlice";
import { setOpenSnackbar } from "@/store/slices/snackBarSlice";
import { UpdateMenuOptions } from "@/types/menu";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
} from "@mui/material";
import { Menu } from "@prisma/client";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { config } from "@/utils/config";

const MenuDetailPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const menuId = Number(router.query.id);
  const menus = useAppSelector((state) => state.menu.items);
  const menu = menus.find((menu) => menu.id === menuId) as Menu;

  const menuCategories = useAppSelector((state) => state.menuCategory.items);
  const menuCategoryMenus = useAppSelector(
    (state) => state.menuCategoryMenu.items
  );
  const menuCategoryIds = menuCategoryMenus
    .filter((menuCategoryMenu) => menuCategoryMenu.menuId === menuId)
    .map((item) => item.menuCategoryId);
  const disabledLocationMenus = useAppSelector(
    (state) => state.disabledLocationMenu.items
  );

  const dispatch = useAppDispatch();

  const [updatedMenu, setUpdatedMenu] = useState<
    UpdateMenuOptions | undefined
  >();

  useEffect(() => {
    if (menu) {
      const exist = disabledLocationMenus.find(
        (item) =>
          item.locationId ===
            Number(localStorage.getItem("selectedLocationId")) &&
          item.menuId === menuId
      );
      setUpdatedMenu({
        id: menu.id,
        name: menu.name,
        price: menu.price,
        menuCategoryIds,
        locationId: Number(localStorage.getItem("selectedLocationId")),
        isAvailable: !exist,
        imageUrl: menu.imageUrl,
      });
    }
  }, [menu, disabledLocationMenus]);

  if (!menu || !updatedMenu) return null;

  const isValid =
    updatedMenu.name &&
    updatedMenu.price !== undefined &&
    updatedMenu.menuCategoryIds.length > 0;

  const handleOnChange = (evt: SelectChangeEvent<number[]>) => {
    const ids = evt.target.value as number[];
    setUpdatedMenu({ ...updatedMenu, menuCategoryIds: ids });
  };

  const onSuccess = () => {
    dispatch(setOpenSnackbar({ message: "Updated menu successfully.." }));
  };

  const handleUpdateMenu = () => {
    dispatch(updateMenu({ ...updatedMenu, onSuccess }));
  };

  const handleMenuImageUpdate = async (evt: ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files;
    if (files) {
      const file = files[0];
      const formData = new FormData();
      formData.append("files", file);
      const response = await fetch(`${config.backofficeApiUrl}/assets`, {
        method: "POST",
        body: formData,
      });
      const { imageUrl } = await response.json();
      dispatch(updateMenu({ ...updatedMenu, imageUrl }));
    }
  };

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Image
          src={menu.imageUrl || "/default-menu.png"}
          alt="menu-image"
          width={160}
          height={160}
          style={{ borderRadius: 8 }}
        />
        <Button
          variant="outlined"
          component="label"
          sx={{ width: "fit-content", mt: 2 }}
        >
          Upload File
          <input type="file" hidden onChange={handleMenuImageUpdate} />
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          variant="outlined"
          type="string"
          sx={{ width: "100%" }}
          defaultValue={menu.name}
          onChange={(evt) =>
            setUpdatedMenu({ ...updatedMenu, name: evt.target.value })
          }
        ></TextField>
        <TextField
          variant="outlined"
          type="number"
          sx={{ width: "100%", my: 3 }}
          defaultValue={menu.price}
          onChange={(evt) =>
            setUpdatedMenu({ ...updatedMenu, price: Number(evt.target.value) })
          }
        ></TextField>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Menu Category</InputLabel>
          <Select
            multiple
            value={updatedMenu.menuCategoryIds}
            input={<OutlinedInput label="Menu Category" />}
            onChange={handleOnChange}
            renderValue={(selectedIds) =>
              menuCategories
                .filter((menuCategory) => selectedIds.includes(menuCategory.id))
                .map((item) => item.name)
                .join(", ")
            }
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                  width: 250,
                },
              },
            }}
          >
            {menuCategories.map((menuCategory) => (
              <MenuItem key={menuCategory.id} value={menuCategory.id}>
                <Checkbox
                  checked={updatedMenu.menuCategoryIds.includes(
                    menuCategory.id
                  )}
                />
                <ListItemText primary={menuCategory.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel
          control={<Switch defaultChecked={updatedMenu.isAvailable} />}
          label="Available"
          sx={{ mt: 2 }}
          onChange={(evt, value) => {
            setUpdatedMenu({ ...updatedMenu, isAvailable: value });
          }}
        />
        <Button
          variant="contained"
          color="primary"
          disabled={!isValid}
          onClick={handleUpdateMenu}
          sx={{ mt: 3, width: "fit-content" }}
        >
          Update
        </Button>
        <DeleteMenu open={open} setOpen={setOpen} menuId={menuId} />
      </Box>
    </Box>
  );
};

export default MenuDetailPage;
