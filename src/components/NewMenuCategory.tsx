import { useAppDispatch } from "@/store/hooks";
import { createMenuCategory } from "@/store/slices/menuCategorySlice";
import { setOpenSnackbar } from "@/store/slices/snackBarSlice";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const NewMenuCategory = ({ open, setOpen }: Props) => {
  const [name, setName] = useState<string>("");
  const dispatch = useAppDispatch();

  const onSuccess = () => {
    setOpen(false);
    dispatch(
      setOpenSnackbar({ message: "Created new menu category successfully.." })
    );
  };

  const handleCreateMenuCategory = () => {
    const selectedLocationId = Number(
      localStorage.getItem("selectedLocationId")
    );
    // careful now, the following dispatch(...) code is async code so we cant know when will its execution end.
    dispatch(
      createMenuCategory({ name, locationId: selectedLocationId, onSuccess })
    );
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Create new menu category</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", justifyContent: "center", width: 300 }}>
          <TextField
            variant="outlined"
            autoFocus
            label="Name"
            defaultValue={""}
            sx={{ mb: 3, mt: 2, width: "100%" }}
            onChange={(evt) => setName(evt.target.value)}
          ></TextField>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!name}
            onClick={handleCreateMenuCategory}
          >
            Confirm
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
