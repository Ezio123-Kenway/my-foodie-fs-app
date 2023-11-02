import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, Box, DialogContent, Typography, Button } from "@mui/material";
import { deleteMenuCategory } from "@/store/slices/menuCategorySlice";
import { setOpenSnackbar } from "@/store/slices/snackBarSlice";
import { removeMenu } from "@/store/slices/menuSlice";
import { removeMenuAddonCategoriesByMenuId } from "@/store/slices/menuAddonCategorySlice";
import { removeAddonCategory } from "@/store/slices/addonCategorySlice";
import { removeAddonsByAddonCategoryId } from "@/store/slices/addonSlice";
import { fetchAppData } from "@/store/slices/appSlice";

interface Props {
  menuCategoryId: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DeleteMenuCategory = ({
  menuCategoryId,
  open,
  setOpen,
}: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSuccess = () => {
    dispatch(
      fetchAppData({
        onSuccess: () => {
          router.push("/backoffice/menu-categories");
          dispatch(
            setOpenSnackbar({ message: "Deleted menu category successfully.." })
          );
        },
      })
    );
  };

  const handleDeleteMenuCategory = () => {
    dispatch(deleteMenuCategory({ id: menuCategoryId, onSuccess }));
  };

  return (
    <Dialog open={open}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <CloseIcon
          color="primary"
          onClick={() => setOpen(false)}
          sx={{ cursor: "pointer" }}
        />
      </Box>
      <DialogContent>
        <Typography variant="h6">
          Are you sure that you want to delete this menu category?
        </Typography>
      </DialogContent>
      <Box
        sx={{ display: "flex", justifyContent: "space-evenly", px: 3, my: 2 }}
      >
        <Button
          variant="contained"
          sx={{ width: "fit-content" }}
          color="primary"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{ width: "fit-content" }}
          color="primary"
          onClick={handleDeleteMenuCategory}
        >
          Confirm
        </Button>
      </Box>
    </Dialog>
  );
};
