import { DeleteAddonCategory } from "@/components/DeleteAddonCategory";
import { DeleteMenu } from "@/components/DeleteMenu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateAddonCategoryThunk } from "@/store/slices/addonCategorySlice";
import { setOpenSnackbar } from "@/store/slices/snackBarSlice";
import { UpdateAddonCategoryOptions } from "@/types/addonCategory";
import {
  Box,
  Button,
  Checkbox,
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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AddonCategoryDetailPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const addonCategoryId = Number(router.query.id);
  const addonCategories = useAppSelector((state) => state.addonCategory.items);
  const menus = useAppSelector((state) => state.menu.items);
  const menuAddonCategories = useAppSelector(
    (state) => state.menuAddonCategory.items
  );
  const addonCategory = addonCategories.find(
    (item) => item.id === addonCategoryId
  );

  console.log(addonCategory?.isRequired);

  const menuIds = menuAddonCategories
    .filter(
      (menuAddonCategory) =>
        menuAddonCategory.addonCategoryId === addonCategoryId
    )
    .map((item) => item.menuId);

  const [updatedAddonCategory, setUpdatedAddonCategory] = useState<
    UpdateAddonCategoryOptions | undefined
  >();

  useEffect(() => {
    if (addonCategory) {
      setUpdatedAddonCategory({
        id: addonCategory.id,
        name: addonCategory.name,
        isRequired: addonCategory.isRequired,
        menuIds,
      });
    }
  }, [addonCategory]);

  if (!addonCategory || !updatedAddonCategory) return null;

  const { name, isRequired } = updatedAddonCategory;

  const isValid =
    name && isRequired !== undefined && updatedAddonCategory.menuIds.length > 0;

  const handleOnChange = (evt: SelectChangeEvent<number[]>) => {
    const selectedIds = evt.target.value as number[];
    setUpdatedAddonCategory({ ...updatedAddonCategory, menuIds: selectedIds });
  };

  const onSuccess = () => {
    dispatch(
      setOpenSnackbar({ message: "Updated addon category successfully.." })
    );
  };

  const handleUpdateAddonCategory = () => {
    dispatch(updateAddonCategoryThunk({ ...updatedAddonCategory, onSuccess }));
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
          sx={{ width: "100%", mb: 2 }}
          defaultValue={addonCategory.name}
          onChange={(evt) =>
            setUpdatedAddonCategory({
              ...updatedAddonCategory,
              name: evt.target.value,
            })
          }
        ></TextField>
        <FormGroup>
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
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Menu</InputLabel>
          <Select
            multiple
            value={updatedAddonCategory.menuIds}
            input={<OutlinedInput label="Menu" />}
            onChange={handleOnChange}
            renderValue={(selectedIds) =>
              menus
                .filter((menu) => selectedIds.includes(menu.id))
                .map((item) => item.name)
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
          disabled={!isValid}
          onClick={handleUpdateAddonCategory}
          sx={{ mt: 3 }}
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
