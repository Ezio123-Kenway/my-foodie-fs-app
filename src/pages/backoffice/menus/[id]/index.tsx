import { DeleteMenu } from "@/components/DeleteMenu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateMenuThunk } from "@/store/slices/menuSlice";
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
import { Menu } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MenuDetailPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const menuId = Number(router.query.id);
  console.log("menuId: ", menuId);
  const menus = useAppSelector((state) => state.menu.items);
  const menu = menus.find((menu) => menu.id === menuId) as Menu;

  const menuCategories = useAppSelector((state) => state.menuCategory.items);
  const menuCategoryMenus = useAppSelector(
    (state) => state.menuCategoryMenu.items
  );
  const menuCategoryIds = menuCategoryMenus
    .filter((menuCategoryMenu) => menuCategoryMenu.menuId === menuId)
    .map((item) => item.menuCategoryId);

  const dispatch = useAppDispatch();

  const [updatedMenu, setUpdatedMenu] = useState<
    UpdateMenuOptions | undefined
  >();

  useEffect(() => {
    if (menu) {
      setUpdatedMenu({
        id: menu.id,
        name: menu.name,
        price: menu.price,
        menuCategoryIds,
      });
    }
  }, [menu]);

  if (!menu || !updatedMenu) return null;

  const isValid =
    updatedMenu.name &&
    updatedMenu.price !== undefined &&
    updatedMenu.menuCategoryIds.length > 0;

  const handleOnChange = (evt: SelectChangeEvent<number[]>) => {
    console.log("value: ", evt.target.value);
    const ids = evt.target.value as number[];
    setUpdatedMenu({ ...updatedMenu, menuCategoryIds: ids });
  };

  const onSuccess = () => {
    router.push("/backoffice/menus");
  };

  const handleUpdateMenu = () => {
    dispatch(updateMenuThunk({ ...updatedMenu, onSuccess }));
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
        <Button
          variant="contained"
          color="primary"
          disabled={!isValid}
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
