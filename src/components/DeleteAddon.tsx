import { useAppDispatch } from "@/store/hooks";
import { setOpenSnackbar } from "@/store/slices/snackBarSlice";
import { Dialog, Box, DialogContent, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { deleteAddon } from "@/store/slices/addonSlice";

interface Props {
  addonId: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DeleteAddon = ({ addonId, open, setOpen }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSuccess = () => {
    router.push("/backoffice/addons");
    dispatch(setOpenSnackbar({ message: "Deleted addon successfully.." }));
  };

  const handleDeleteAddon = () => {
    dispatch(deleteAddon({ id: addonId, onSuccess }));
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
          Are you sure that you want to delete this table?
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
          onClick={handleDeleteAddon}
        >
          Confirm
        </Button>
      </Box>
    </Dialog>
  );
};
