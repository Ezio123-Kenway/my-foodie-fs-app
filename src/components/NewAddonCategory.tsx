import menuCategories from "@/pages/api/menu-categories";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createAddonCategory } from "@/store/slices/addonCategorySlice";
import { setOpenSnackBar } from "@/store/slices/snackBarSlice";
import { CreateAddOnCategoryOptions } from "@/types/addonCategory";
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
    useState<CreateAddOnCategoryOptions>(defaultNewAddonCategory);
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
      setOpenSnackBar({ message: "Created new addon category successfully.." })
    );
  };

  const handleCreateAddonCategory = () => {
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
            defaultValue={defaultNewAddonCategory.name}
            sx={{ my: 1 }}
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
              onChange={(evt, value) =>
                setNewAddonCategory({ ...newAddonCategory, isRequired: value })
              }
            />
          </FormGroup>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Menu</InputLabel>
            <Select
              multiple
              value={newAddonCategory.menuIds}
              label="Menu"
              sx={{ width: 400 }}
              onChange={handleOnChange}
              input={<OutlinedInput label="Menu" />}
              renderValue={(selectedMenuIds) => {
                return menus
                  .filter((menu) => selectedMenuIds.includes(menu.id))
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
                <MenuItem value={menu.id} key={menu.id}>
                  <Checkbox
                    checked={newAddonCategory.menuIds.includes(menu.id)}
                  />
                  <ListItemText primary={menu.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ width: "fit-content" }}
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
