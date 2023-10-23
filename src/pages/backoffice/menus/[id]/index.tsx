import { DeleteMenu } from "@/components/DeleteMenu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { UpdateMenuOptions } from "@/types/menu";
// import { deleteMenuThunk, updateMenuThunk } from "@/store/slices/menuSlice";
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
import { useState } from "react";

const MenuDetailPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const menuId = Number(router.query.id);
  const menus = useAppSelector((state) => state.menu.items);
  const menu = menus.find((menu) => menu.id === menuId);

  const menuCategories = useAppSelector((state) => state.menuCategory.items);
  const menuCategoryMenus = useAppSelector(
    (state) => state.menuCategoryMenu.items
  );
  const menuCategoryIds = menuCategoryMenus
    .filter((menuCategoryMenu) => menuCategoryMenu.menuId === menuId)
    .map((item) => item.menuCategoryId);

  const dispatch = useAppDispatch();

  if (!menu) return null;

  const defaultUpdatedMenu = {
    id: menu.id as number,
    name: menu.name as string,
    price: menu.price as number,
    menuCategoryIds,
  };

  const [updatedMenu, setUpdatedMenu] =
    useState<UpdateMenuOptions>(defaultUpdatedMenu);

  const nameIsChanged = updatedMenu.name !== defaultUpdatedMenu.name;

  const priceIsChanged = updatedMenu.price !== defaultUpdatedMenu.price;

  const isValid = updatedMenu.name && updatedMenu.price > 0;

  const isChanged = (nameIsChanged || priceIsChanged) && isValid;

  const handleOnChange = (evt: SelectChangeEvent<number[]>) => {
    console.log(evt.target.value);
  };

  const handleUpdateMenu = () => {
    router.push("/backoffice/menus");
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
          defaultValue={defaultUpdatedMenu.name}
          onChange={(evt) =>
            setUpdatedMenu({ ...updatedMenu, name: evt.target.value })
          }
        ></TextField>
        <TextField
          variant="outlined"
          sx={{ width: "100%", my: 3 }}
          defaultValue={defaultUpdatedMenu.price}
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
        <Button
          variant="contained"
          color="primary"
          disabled={!isChanged}
          onClick={handleUpdateMenu}
          sx={{ mt: 3 }}
        >
          Update
        </Button>
        <DeleteMenu open={open} setOpen={setOpen} menuId={menuId} />
      </Box>
    </Box>
  );
};

export default MenuDetailPage;
