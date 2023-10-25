import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createMenu } from "@/store/slices/menuSlice";
import { CreateMenuOptions } from "@/types/menu";
import {
  Box,
  Button,
  Checkbox,
  Chip,
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
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const defaultMenu: CreateMenuOptions = {
  name: "",
  price: 0,
  menuCategoryIds: [],
};

export const NewMenu = ({ open, setOpen }: Props) => {
  const [newMenu, setNewMenu] = useState<CreateMenuOptions>(defaultMenu);
  const dispatch = useAppDispatch();
  const menuCategories = useAppSelector((state) => state.menuCategory.items);

  const handleOnChange = (evt: SelectChangeEvent<number[]>) => {
    const selectedIds = evt.target.value as number[];
    setNewMenu({ ...newMenu, menuCategoryIds: selectedIds });
  };

  const { name, price, menuCategoryIds } = newMenu;
  const canCreate = name && price !== undefined && menuCategoryIds.length;

  const onSuccess = () => {
    setOpen(false);
  };

  const handleCreateMenu = () => {
    dispatch(createMenu({ ...newMenu, onSuccess }));
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setNewMenu({ ...newMenu, menuCategoryIds: [] });
      }}
    >
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
            sx={{ mt: 1 }}
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
            sx={{ mt: 4, mb: 2 }}
            defaultValue={defaultMenu.price}
            onChange={(evt) =>
              setNewMenu({ ...newMenu, price: Number(evt.target.value) })
            }
          ></TextField>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Menu Category</InputLabel>
            <Select
              multiple
              value={newMenu.menuCategoryIds}
              input={<OutlinedInput label="Menu Category" />}
              onChange={handleOnChange}
              sx={{ width: 400 }}
              renderValue={(menuCategoryIds) => {
                return menuCategories
                  .filter((menuCategory) =>
                    menuCategoryIds.includes(menuCategory.id)
                  )
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
              {menuCategories.map((menuCategory) => (
                <MenuItem key={menuCategory.id} value={menuCategory.id}>
                  <Checkbox
                    checked={newMenu.menuCategoryIds.includes(menuCategory.id)}
                  />
                  <ListItemText primary={menuCategory.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
              disabled={!canCreate}
              onClick={handleCreateMenu}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
