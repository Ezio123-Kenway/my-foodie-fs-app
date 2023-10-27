import menuCategories from "@/pages/api/menu-categories";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createAddon } from "@/store/slices/addonSlice";
import { setOpenSnackbar } from "@/store/slices/snackBarSlice";
import { CreateAddonOptions } from "@/types/addon";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { AddonCategory } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const defaultAddon = {
  name: "",
  price: 0,
  addonCategoryId: undefined,
};

export const NewAddon = ({ open, setOpen }: Props) => {
  const [newAddon, setNewAddon] = useState<CreateAddonOptions>(defaultAddon);
  const addonCategories = useAppSelector((state) => state.addonCategory.items);
  const dispatch = useAppDispatch();

  const { name, price, addonCategoryId } = newAddon;

  const canCreate = name && price !== undefined && addonCategoryId;

  const handleOnChange = (evt: SelectChangeEvent<number>) => {
    const selectedId = evt.target.value as number;
    setNewAddon({ ...newAddon, addonCategoryId: selectedId });
  };

  const onSuccess = () => {
    setOpen(false);
    dispatch(setOpenSnackbar({ message: "Created new addon successfully.." }));
    setNewAddon(defaultAddon);
  };

  const handleCreateAddon = () => {
    dispatch(createAddon({ ...newAddon, onSuccess }));
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setNewAddon(defaultAddon);
      }}
    >
      <DialogTitle>Create new addon</DialogTitle>
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
            sx={{ mt: 1 }}
            defaultValue={defaultAddon.name}
            onChange={(evt) =>
              setNewAddon({ ...newAddon, name: evt.target.value })
            }
          ></TextField>
          <TextField
            id="Price"
            label="Price"
            variant="outlined"
            type="number"
            sx={{ mt: 4, mb: 2 }}
            defaultValue={defaultAddon.price}
            onChange={(evt) =>
              setNewAddon({ ...newAddon, price: Number(evt.target.value) })
            }
          ></TextField>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Addon Category</InputLabel>
            <Select
              value={newAddon.addonCategoryId || ""}
              input={<OutlinedInput label="Addon Category" />}
              onChange={handleOnChange}
              sx={{ width: 400 }}
              renderValue={(addonCategoryId) => {
                return (
                  addonCategories.find(
                    (addonCategory) => addonCategory.id === addonCategoryId
                  ) as AddonCategory
                ).name;
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 48 * 4.5 + 8,
                    width: 250,
                  },
                },
              }}
            >
              {addonCategories.map((addonCategory) => (
                <MenuItem key={addonCategory.id} value={addonCategory.id}>
                  <ListItemText primary={addonCategory.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
              onClick={handleCreateAddon}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
