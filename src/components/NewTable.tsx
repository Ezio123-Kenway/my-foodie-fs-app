import { useAppDispatch } from "@/store/hooks";
import { setOpenSnackbar } from "@/store/slices/snackBarSlice";
import { createTable } from "@/store/slices/tableSlice";
import { CreateTableOptions } from "@/types/table";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const defaultTable = {
  name: "",
  locationId: undefined,
};

export const NewTable = ({ open, setOpen }: Props) => {
  const [newTable, setNewTable] = useState<CreateTableOptions>(defaultTable);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setNewTable({
      ...newTable,
      locationId: Number(localStorage.getItem("selectedLocationId")),
    });
  }, []);

  // const canCreate = newTable.name && newTable.locationId !== undefined;

  const onSuccess = () => {
    dispatch(setOpenSnackbar({ message: "Created new table successfully.." })),
      setOpen(false);
  };

  const handleCreateTable = () => {
    dispatch(
      createTable({
        ...newTable,
        onSuccess,
      })
    );
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Create new table</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "centers",
          }}
        >
          <TextField
            id="Name"
            label="Name"
            variant="outlined"
            type="string"
            sx={{ mt: 1, mb: 2, width: 300 }}
            defaultValue={defaultTable.name}
            onChange={(evt) =>
              setNewTable({ ...newTable, name: evt.target.value })
            }
          ></TextField>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
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
              disabled={!newTable.name}
              onClick={handleCreateTable}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
