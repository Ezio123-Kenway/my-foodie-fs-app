import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Dispatch, SetStateAction } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/router";
import { deleteMenu } from "@/store/slices/menuSlice";
import { setOpenSnackbar } from "@/store/slices/snackBarSlice";
import { removeAddonCategory } from "@/store/slices/addonCategorySlice";
import { removeAddonsByAddonCategoryId } from "@/store/slices/addonSlice";

interface Props {
  menuId: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DeleteMenu = ({ open, setOpen, menuId }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const menuAddonCategories = useAppSelector(
    (state) => state.menuAddonCategory.items
  );

  const onSuccess = () => {
    router.push("/backoffice/menus");
    dispatch(setOpenSnackbar({ message: "Deleted menu successfully.." }));
    const addonCategoryIds = menuAddonCategories
      .filter((item) => item.menuId === menuId)
      .map((element) => element.addonCategoryId);
    addonCategoryIds.forEach((addonCategoryId) => {
      const menuAddonCategoryRows = menuAddonCategories.filter(
        (innerItem) => innerItem.addonCategoryId === addonCategoryId
      );
      if (menuAddonCategoryRows.length === 1) {
        // one addon-category is connected to only one menu
        dispatch(removeAddonCategory({ id: addonCategoryId }));
        dispatch(removeAddonsByAddonCategoryId({ addonCategoryId }));
      }
    });
  };

  const handleDeleteMenu = () => {
    dispatch(deleteMenu({ id: menuId, onSuccess }));
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
          Are you sure that you want to delete this menu?
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
          onClick={handleDeleteMenu}
        >
          Confirm
        </Button>
      </Box>
    </Dialog>
  );
};
