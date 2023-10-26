import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createAddonCategory } from "@/store/slices/addonCategorySlice";
import { setOpenSnackbar } from "@/store/slices/snackBarSlice";
import { CreateAddonCategoryOptions } from "@/types/addonCategory";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const defaultNewAddonCategory = {
  name: "",
  isRequired: false,
  menuIds: [],
};

export const NewAddonCategory = ({ open, setOpen }: Props) => {
  const [newAddonCategory, setNewAddonCategory] =
    useState<CreateAddonCategoryOptions>(defaultNewAddonCategory);
  const menus = useAppSelector((state) => state.menu.items);
  const dispatch = useAppDispatch();

  const { name, isRequired, menuIds } = newAddonCategory;
  const canCreate = name && isRequired !== undefined && menuIds.length > 0;

  const handleOnChange = (evt: SelectChangeEvent<number[]>) => {
    const selectedIds = evt.target.value as number[];
    setNewAddonCategory({ ...newAddonCategory, menuIds: selectedIds });
  };

  const onSuccess = () => {
    setOpen(false);
    dispatch(
      setOpenSnackbar({ message: "Created new addon category successfully.." })
    );
  };

  const handleCreateAddonCategory = () => {
    console.log(newAddonCategory);
    dispatch(createAddonCategory({ ...newAddonCategory, onSuccess }));
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Create new addon category</DialogTitle>
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
            sx={{ mt: 1, mb: 2 }}
            defaultValue={defaultNewAddonCategory.name}
            onChange={(evt) =>
              setNewAddonCategory({
                ...newAddonCategory,
                name: evt.target.value,
              })
            }
          ></TextField>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked={false} />}
              label="isRequired"
              onChange={(evt, value) => {
                setNewAddonCategory({ ...newAddonCategory, isRequired: value });
              }}
            />
          </FormGroup>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Menu</InputLabel>
            <Select
              multiple
              value={newAddonCategory.menuIds}
              input={<OutlinedInput label="Menu" />}
              onChange={handleOnChange}
              sx={{ width: 400 }}
              renderValue={(menuIds) => {
                return menus
                  .filter((menu) => menuIds.includes(menu.id))
                  .map((item) => item.name)
                  .join(", ");
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
              {menus.map((menu) => (
                <MenuItem key={menu.id} value={menu.id}>
                  <Checkbox
                    checked={newAddonCategory.menuIds.includes(menu.id)}
                  />
                  <ListItemText primary={menu.name} />
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
              onClick={handleCreateAddonCategory}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
