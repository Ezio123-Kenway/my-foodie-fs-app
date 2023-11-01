import { DeleteMenuCategory } from "@/components/DeleteMenuCategory";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateMenuCategory } from "@/store/slices/menuCategorySlice";
import { setOpenSnackbar } from "@/store/slices/snackBarSlice";
import { UpdateMenuCategoryOptions } from "@/types/menuCategory";
import { Box, Button, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const menuCategoryDetailPage = () => {
  const [updatedMenuCategory, setUpdatedMenuCategory] = useState<
    UpdateMenuCategoryOptions | undefined
  >();
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const menuCategoryId = Number(router.query.id);
  const menuCategories = useAppSelector((state) => state.menuCategory.items);
  console.log("menuCategories: ", menuCategories);
  const menuCategory = menuCategories.find(
    (item) => item.id === menuCategoryId
  );

  useEffect(() => {
    if (menuCategory) {
      setUpdatedMenuCategory({
        id: menuCategory.id,
        name: menuCategory.name,
        locationId: Number(localStorage.getItem("selectedLocationId")),
      });
    }
  }, [menuCategory]);

  if (!menuCategory || !updatedMenuCategory) return null;

  const handleUpdateMenuCategory = () => {
    dispatch(
      updateMenuCategory({
        ...updatedMenuCategory,
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
          sx={{ width: "100%" }}
          defaultValue={menuCategory.name}
          onChange={(evt) =>
            setUpdatedMenuCategory({
              ...updatedMenuCategory,
              name: evt.target.value,
            })
          }
        ></TextField>
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

export default menuCategoryDetailPage;
