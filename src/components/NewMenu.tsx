import { useAppDispatch } from "@/store/hooks";
import { createMenu } from "@/store/slices/menuSlice";
import { CreateMenuType } from "@/types/menu";
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

const defaultMenu = { name: "", price: 0, description: "" };

export const NewMenu = ({ open, setOpen }: Props) => {
  const [newMenu, setNewMenu] = useState<CreateMenuType>(defaultMenu);
  const dispatch = useAppDispatch();

  const { name, price } = newMenu;
  const canCreate = name && price > 0;

  const handleCreateMenu = () => {
    dispatch(createMenu(newMenu));
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Create new menu</DialogTitle>
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
            defaultValue={defaultMenu.name}
            onChange={(evt) =>
              setNewMenu({ ...newMenu, name: evt.target.value })
            }
          ></TextField>
          <TextField
            id="Price"
            label="Price"
            variant="outlined"
            type="number"
            sx={{ my: 3 }}
            defaultValue={defaultMenu.price}
            onChange={(evt) =>
              setNewMenu({ ...newMenu, price: Number(evt.target.value) })
            }
          ></TextField>
          <TextField
            id="Description"
            label="Description"
            variant="outlined"
            type="string"
            multiline
            rows={4}
            defaultValue={defaultMenu.description}
            onChange={(evt) =>
              setNewMenu({ ...newMenu, description: evt.target.value })
            }
          ></TextField>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ width: "fit-content", mt: 2 }}
              disabled={canCreate ? false : true}
              onClick={handleCreateMenu}
            >
              Create
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
