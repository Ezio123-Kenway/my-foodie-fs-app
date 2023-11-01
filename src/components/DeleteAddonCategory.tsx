import { Dialog, Box, DialogContent, Typography, Button } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/router";
import { deleteAddonCategory } from "@/store/slices/addonCategorySlice";
import { setOpenSnackbar } from "@/store/slices/snackBarSlice";

interface Props {
  addonCategoryId: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DeleteAddonCategory = ({
  addonCategoryId,
  open,
  setOpen,
}: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSuccess = () => {
    router.push("/backoffice/addon-categories");
    dispatch(
      setOpenSnackbar({ message: "Deleted addon category successfully.." })
    );
  };

  const handleDeleteAddonCategory = () => {
    dispatch(deleteAddonCategory({ id: addonCategoryId, onSuccess }));
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
          Are you sure that you want to delete this addon category?
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
          onClick={handleDeleteAddonCategory}
        >
          Confirm
        </Button>
      </Box>
    </Dialog>
  );
};
