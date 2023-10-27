import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { useRouter } from "next/router";
import menuCategories from "../../menu-categories";
import { useEffect, useState } from "react";
import { DeleteAddonCategory } from "@/components/DeleteAddonCategory";
import { UpdateAddOnCategoryOptions } from "@/types/addonCategory";
import { updateAddonCategory } from "@/store/slices/addonCategorySlice";
import { setOpenSnackBar } from "@/store/slices/snackBarSlice";

const AddonCategoryDetailPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const addonCategoryId = Number(router.query.id);
  const addonCategories = useAppSelector((state) => state.addonCategory.items);
  const addonCategory = addonCategories.find(
    (item) => item.id === addonCategoryId
  );
  const menus = useAppSelector((state) => state.menu.items);
  const menuAddonCategories = useAppSelector(
    (state) => state.menuAddonCategory.items
  );
  const selectedMenuIds = menuAddonCategories
    .filter((item) => item.addonCategoryId === addonCategoryId)
    .map((element) => element.menuId);
  const [updatedAddonCategory, setUpdatedAddonCategory] = useState<
    UpdateAddOnCategoryOptions | undefined
  >();

  useEffect(() => {
    if (addonCategory) {
      setUpdatedAddonCategory({
        id: addonCategory.id,
        name: addonCategory.name,
        isRequired: addonCategory.isRequired,
        menuIds: selectedMenuIds,
      });
    }
  }, [addonCategory]);

  if (!addonCategory || !updatedAddonCategory) return null;

  const { name, isRequired, menuIds } = updatedAddonCategory;

  const canUpdate = name && isRequired !== undefined && menuIds.length > 0;

  const handleOnChange = (evt: SelectChangeEvent<number[]>) => {
    const selectedIds = evt.target.value as number[];
    setUpdatedAddonCategory({ ...updatedAddonCategory, menuIds: selectedIds });
  };

  const handleUpdateAddonCategory = () => {
    dispatch(
      updateAddonCategory({
        ...updatedAddonCategory,
        onSuccess: () =>
          dispatch(
            setOpenSnackBar({
              message: "Updated addon category successfully..",
            })
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
          sx={{ width: "100%" }}
          defaultValue={addonCategory.name}
          onChange={(evt) =>
            setUpdatedAddonCategory({
              ...updatedAddonCategory,
              name: evt.target.value,
            })
          }
        ></TextField>
        <FormGroup sx={{ mt: 1, mb: 3 }}>
          <FormControlLabel
            control={<Checkbox defaultChecked={addonCategory.isRequired} />}
            label="isRequired"
            onChange={(evt, value) =>
              setUpdatedAddonCategory({
                ...updatedAddonCategory,
                isRequired: value,
              })
            }
          />
        </FormGroup>
        <FormControl fullWidth>
          <InputLabel>Menu</InputLabel>
          <Select
            multiple
            input={<OutlinedInput label="Menu" />}
            sx={{ width: "100%" }}
            value={updatedAddonCategory.menuIds}
            onChange={handleOnChange}
            renderValue={(selectedMenuIds) =>
              menus
                .filter((item) => selectedMenuIds.includes(item.id))
                .map((element) => element.name)
                .join(", ")
            }
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
                  checked={updatedAddonCategory.menuIds.includes(menu.id)}
                />
                <ListItemText primary={menu.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          disabled={!canUpdate}
          onClick={handleUpdateAddonCategory}
          sx={{ width: "fit-content", mt: 3 }}
        >
          Update
        </Button>
        <DeleteAddonCategory
          open={open}
          setOpen={setOpen}
          addonCategoryId={addonCategoryId}
        />
      </Box>
    </Box>
  );
};

export default AddonCategoryDetailPage;
