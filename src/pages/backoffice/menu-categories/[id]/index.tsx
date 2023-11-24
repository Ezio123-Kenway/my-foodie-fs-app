import { DeleteMenuCategory } from "@/components/DeleteMenuCategory";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateMenuCategory } from "@/store/slices/menuCategorySlice";
import { setOpenSnackbar } from "@/store/slices/snackBarSlice";
import { UpdateMenuCategoryOptions } from "@/types/menuCategory";
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MenuCategoryDetailPage = () => {
  const [updatedMenuCategory, setUpdatedMenuCategory] = useState<
    UpdateMenuCategoryOptions | undefined
  >();
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const menuCategoryId = Number(router.query.id);
  const menuCategories = useAppSelector((state) => state.menuCategory.items);
  const menuCategory = menuCategories.find(
    (item) => item.id === menuCategoryId
  );
  const disabledLocationMenuCategories = useAppSelector(
    (state) => state.disabledLocationMenuCategory.items
  );

  useEffect(() => {
    if (menuCategory) {
      const exist = disabledLocationMenuCategories.find(
        (item) =>
          item.locationId ===
            Number(localStorage.getItem("selectedLocationId")) &&
          item.menuCategoryId === menuCategory.id
      );
      setUpdatedMenuCategory({
        id: menuCategory.id,
        name: menuCategory.name,
        locationId: Number(localStorage.getItem("selectedLocationId")),
        isAvailable: !exist,
      });
    }
  }, [menuCategory, disabledLocationMenuCategories]);

  if (!menuCategory || !updatedMenuCategory) return null;

  const handleUpdateMenuCategory = () => {
    dispatch(
      updateMenuCategory({
        ...updatedMenuCategory,
        locationId: Number(localStorage.getItem("selectedLocationId")),
        onSuccess: () =>
          dispatch(
            setOpenSnackbar({ message: "Updated menu category successfully." })
          ),
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
          type="string"
          sx={{ width: "100%", mb: 1 }}
          defaultValue={menuCategory.name}
          onChange={(evt) =>
            setUpdatedMenuCategory({
              ...updatedMenuCategory,
              name: evt.target.value,
            })
          }
        ></TextField>
        <FormControlLabel
          control={
            <Switch
              defaultChecked={updatedMenuCategory.isAvailable}
              onChange={(evt, value) =>
                setUpdatedMenuCategory({
                  ...updatedMenuCategory,
                  isAvailable: value,
                })
              }
            />
          }
          label="Available"
        />
        <Button
          variant="contained"
          color="primary"
          disabled={!updatedMenuCategory.name}
          onClick={handleUpdateMenuCategory}
          sx={{ mt: 3, width: "fit-content" }}
        >
          Update
        </Button>
        <DeleteMenuCategory
          open={open}
          setOpen={setOpen}
          menuCategoryId={menuCategoryId}
        />
      </Box>
    </Box>
  );
};

export default MenuCategoryDetailPage;
