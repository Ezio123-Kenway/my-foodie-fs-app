import { useAppDispatch } from "@/store/hooks";
import { createLocation } from "@/store/slices/locationSlice";
import { setOpenSnackbar } from "@/store/slices/snackBarSlice";
import { CreateLocationOptions } from "@/types/location";
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

const defaultLocation = {
  name: "",
  address: "",
  companyId: undefined,
};

export const NewLocation = ({ open, setOpen }: Props) => {
  const [newLocation, setNewLocation] =
    useState<CreateLocationOptions>(defaultLocation);
  const dispatch = useAppDispatch();

  const canCreate = newLocation.name && newLocation.address;

  const onSuccess = () => {
    setOpen(false);
    dispatch(
      setOpenSnackbar({ message: "Created new location successfully.." })
    );
  };

  const handleCreateLocation = () => {
    console.log("newLocation: ", newLocation);
    dispatch(createLocation({ ...newLocation, onSuccess }));
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Create new location</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "centers",
            width: 400,
          }}
        >
          <TextField
            id="Name"
            label="Name"
            variant="outlined"
            type="string"
            sx={{ mt: 1, width: "100%" }}
            defaultValue={defaultLocation.name}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, name: evt.target.value })
            }
          ></TextField>
          <TextField
            id="Address"
            label="Address"
            variant="outlined"
            type="string"
            sx={{ mt: 4, mb: 2, width: "100%" }}
            defaultValue={defaultLocation.address}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, address: evt.target.value })
            }
          ></TextField>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
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
              color="primary"
              sx={{ width: "fit-content" }}
              disabled={!canCreate}
              onClick={handleCreateLocation}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
