import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateAddon } from "@/store/slices/addonSlice";
import { setOpenSnackbar } from "@/store/slices/snackBarSlice";
import { UpdateAddonOptions } from "@/types/addon";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AddonCategory } from "@prisma/client";
import { DeleteAddon } from "@/components/DeleteAddon";

const AddonDetailPage = () => {
  const [updatedAddon, setUpdatedAddon] = useState<
    UpdateAddonOptions | undefined
  >();
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const addonId = Number(router.query.id);
  const addons = useAppSelector((state) => state.addon.items);
  const addonCategories = useAppSelector((state) => state.addonCategory.items);
  const addon = addons.find((item) => item.id === addonId);

  useEffect(() => {
    if (addon) {
      setUpdatedAddon({
        id: addon.id,
        name: addon.name,
        price: addon.price,
        addonCategoryId: addon.addonCategoryId,
      });
    }
  }, [addon]);

  if (!addon || !updatedAddon) return null;

  const { name, price, addonCategoryId } = updatedAddon;

  const canUpdate = name && price !== undefined && addonCategoryId;

  const handleOnChange = (evt: SelectChangeEvent<number>) => {
    const selectedId = evt.target.value as number;
    setUpdatedAddon({ ...updatedAddon, addonCategoryId: selectedId });
  };

  const handleUpdateAddon = () => {
    dispatch(
      updateAddon({
        ...updatedAddon,
        onSuccess: () =>
          dispatch(
            setOpenSnackbar({ message: "Updated addon successfully.." })
          ),
      })
    );
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Delete
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          variant="outlined"
          type="string"
          sx={{ width: "100%" }}
          defaultValue={addon.name}
          onChange={(evt) =>
            setUpdatedAddon({ ...updatedAddon, name: evt.target.value })
          }
        ></TextField>
        <TextField
          variant="outlined"
          type="number"
          sx={{ width: "100%", my: 3 }}
          defaultValue={addon.price}
          onChange={(evt) =>
            setUpdatedAddon({
              ...updatedAddon,
              price: Number(evt.target.value),
            })
          }
        ></TextField>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Addon Category</InputLabel>
          <Select
            value={updatedAddon.addonCategoryId}
            input={<OutlinedInput label="Addon Category" />}
            onChange={handleOnChange}
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
        <Button
          variant="contained"
          color="primary"
          disabled={!canUpdate}
          onClick={handleUpdateAddon}
          sx={{ mt: 3, width: "fit-content" }}
        >
          Update
        </Button>
        <DeleteAddon open={open} setOpen={setOpen} addonId={addonId} />
      </Box>
    </Box>
  );
};

export default AddonDetailPage;
