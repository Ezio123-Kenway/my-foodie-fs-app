import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createMenu } from "@/store/slices/menuSlice";
import { CreateMenuOptions } from "@/types/menu";
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
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const defaultMenu = { name: "", price: 0, menuCategoryIds: [] };

export const NewMenu = ({ open, setOpen }: Props) => {
  const menuCategories = useAppSelector((state) => state.menuCategory.items);

  const [newMenu, setNewMenu] = useState<CreateMenuOptions>(defaultMenu);
  const dispatch = useAppDispatch();

  const { name, price, menuCategoryIds } = newMenu;
  const canCreate = name && price > 0 && menuCategoryIds.length;

  const handleOnChange = (evt: SelectChangeEvent<number[]>) => {
    const selectedIds = evt.target.value as number[];
    // console.log(selectedIds);
    setNewMenu({ ...newMenu, menuCategoryIds: selectedIds });
  };

  const handleCreateMenu = () => {
    console.log(newMenu);
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
            defaultValue={defaultMenu.name}
            sx={{ mt: 1 }}
            onChange={(evt) =>
              setNewMenu({ ...newMenu, name: evt.target.value })
            }
          ></TextField>
          <TextField
            id="Price"
            label="Price"
            variant="outlined"
            type="number"
            sx={{ mt: 3, mb: 1 }}
            defaultValue={defaultMenu.price}
            onChange={(evt) =>
              setNewMenu({ ...newMenu, price: Number(evt.target.value) })
            }
          ></TextField>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Menu Category</InputLabel>
            <Select
              multiple
              value={menuCategoryIds}
              label="Menu Category"
              sx={{ width: 400 }}
              onChange={handleOnChange}
              input={<OutlinedInput label="Menu Category" />}
              renderValue={(selectedMenuCategoryIds) => {
                return menuCategories
                  .filter((menuCategory) =>
                    selectedMenuCategoryIds.includes(menuCategory.id)
                  )
                  .map((selectedMenuCategory) => selectedMenuCategory.name)
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
                <MenuItem value={menuCategory.id} key={menuCategory.id}>
                  <Checkbox
                    checked={menuCategoryIds.includes(menuCategory.id)}
                  />
                  <ListItemText primary={menuCategory.name} />
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
