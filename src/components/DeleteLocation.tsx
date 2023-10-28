import { useAppDispatch } from "@/store/hooks";
import { deleteLocation } from "@/store/slices/locationSlice";
import { setOpenSnackbar } from "@/store/slices/snackBarSlice";
import { Dialog, Box, DialogContent, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  locationId: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DeleteLocation = ({ locationId, open, setOpen }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSuccess = () => {
    router.push("/backoffice/locations");
    dispatch(setOpenSnackbar({ message: "Deleted location successfully.." }));
  };

  const handleDeleteLocation = () => {
    dispatch(deleteLocation({ id: locationId, onSuccess }));
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
          Are you sure that you want to delete this location?
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
          onClick={handleDeleteLocation}
        >
          Confirm
        </Button>
      </Box>
    </Dialog>
  );
};
