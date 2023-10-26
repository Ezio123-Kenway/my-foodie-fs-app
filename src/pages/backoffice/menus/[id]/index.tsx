import { DeleteMenu } from "@/components/DeleteMenu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateMenuThunk } from "@/store/slices/menuSlice";
import { setOpenSnackBar } from "@/store/slices/snackBarSlice";
import { UpdateMenuOptions } from "@/types/menu";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MenuDetailPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const menuId = Number(router.query.id);
  const menus = useAppSelector((state) => state.menu.items);
  const menuCategories = useAppSelector((state) => state.menuCategory.items);
  const menuCatgeoryMenus = useAppSelector(
    (state) => state.menuCategoryMenu.items
  );
  const dispatch = useAppDispatch();
  const menu = menus.find((menu) => menu.id === menuId);

  const selectedMenuCategoryIds = menuCatgeoryMenus
    .filter((menuCategoryMenu) => menuCategoryMenu.menuId === menuId)
    .map((item) => item.menuCategoryId);

  const [updatedMenu, setUpdatedMenu] = useState<
    UpdateMenuOptions | undefined
  >();

  useEffect(() => {
    if (menu) {
      setUpdatedMenu({
        id: menu.id,
        name: menu.name,
        price: menu.price,
        menuCategoryIds: selectedMenuCategoryIds,
      });
    }
  }, [menu]);

  if (!menu || !updatedMenu) return null;

  const { name, price, menuCategoryIds } = updatedMenu;

  const canUpdate = name && price !== undefined && menuCategoryIds.length > 0;

  const handleOnChange = (evt: SelectChangeEvent<number[]>) => {
    const selectedIds = evt.target.value as number[];
    setUpdatedMenu({ ...updatedMenu, menuCategoryIds: selectedIds });
  };

  const handleUpdateMenu = () => {
    dispatch(
      updateMenuThunk({
        ...updatedMenu,
        onSuccess: () =>
          dispatch(setOpenSnackBar({ message: "Updated menu successfully.." })),
      })
    );
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
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          variant="outlined"
          sx={{ width: "100%" }}
          defaultValue={menu.name}
          onChange={(evt) =>
            setUpdatedMenu({ ...updatedMenu, name: evt.target.value })
          }
        ></TextField>
        <TextField
          variant="outlined"
          sx={{ width: "100%", my: 4 }}
          defaultValue={menu.price}
          onChange={(evt) =>
            setUpdatedMenu({ ...updatedMenu, price: Number(evt.target.value) })
          }
        ></TextField>
        <FormControl fullWidth>
          <InputLabel>Menu Category</InputLabel>
          <Select
            multiple
            input={<OutlinedInput label="Menu Category" />}
            sx={{ width: "100%" }}
            value={updatedMenu.menuCategoryIds}
            onChange={handleOnChange}
            renderValue={(selectedMenuCategoryIds) =>
              menuCategories
                .filter((item) => selectedMenuCategoryIds.includes(item.id))
                .map((element) => element.name)
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
        <Button
          variant="contained"
          color="primary"
          disabled={!canUpdate}
          onClick={handleUpdateMenu}
          sx={{ width: "fit-content", mt: 3 }}
        >
          Update
        </Button>
        <DeleteMenu open={open} setOpen={setOpen} menuId={menuId} />
      </Box>
    </Box>
  );
};

export default MenuDetailPage;
