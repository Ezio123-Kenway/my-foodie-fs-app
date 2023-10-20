import { useAppDispatch } from "@/store/hooks";
import { createLocation } from "@/store/slices/locationSlice";
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

const defaultNewLocation = {
  name: "",
  address: "",
};

export const NewLocation = ({ open, setOpen }: Props) => {
  const [newLocation, setNewLocation] = useState(defaultNewLocation);
  const dispatch = useAppDispatch();

  const { name, address } = newLocation;

  const canCreate = name && address;

  const onSuccess = () => {
    setOpen(false);
  };

  const handleCreateLocation = () => {
    dispatch(createLocation({ ...newLocation, onSuccess }));
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "400px", // Set your width here
          },
        },
      }}
    >
      <DialogTitle>Create new location</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            variant="outlined"
            label="Name"
            sx={{ width: "100%" }}
            defaultValue={defaultNewLocation.name}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, name: evt.target.value })
            }
          ></TextField>
          <TextField
            variant="outlined"
            label="Address"
            sx={{ my: 3, width: "100%" }}
            defaultValue={defaultNewLocation.address}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, address: evt.target.value })
            }
          ></TextField>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
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
            disabled={!canCreate}
            onClick={handleCreateLocation}
          >
            Confirm
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
