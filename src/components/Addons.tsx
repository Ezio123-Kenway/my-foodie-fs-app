import { useAppSelector } from "@/store/hooks";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface Props {
  addonCategoryId: number;
  selectedAddonIds: number[];
  setSelectedAddonIds: Dispatch<SetStateAction<number[]>>;
}

export const Addons = ({
  addonCategoryId,
  selectedAddonIds,
  setSelectedAddonIds,
}: Props) => {
  const addonCategory = useAppSelector(
    (state) => state.addonCategory.items
  ).find((item) => item.id === addonCategoryId);

  const relatedAddons = useAppSelector((state) => state.addon.items).filter(
    (item) => item.addonCategoryId === addonCategoryId
  );

  if (!addonCategory) return null;

  return (
    <Box>
      {relatedAddons.map((addon) => {
        return (
          <Box
            key={addon.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              control={
                addonCategory.isRequired ? (
                  <Radio
                    color="success"
                    checked={
                      selectedAddonIds.find((item) => item === addon.id)
                        ? true
                        : false
                    }
                    onChange={() => {
                      const relatedAddonIds = relatedAddons.map(
                        (item) => item.id
                      );
                      const others = selectedAddonIds.filter(
                        (selectedId) => !relatedAddonIds.includes(selectedId)
                      );
                      setSelectedAddonIds([...others, addon.id]);
                    }}
                  />
                ) : (
                  <Checkbox
                    color="success"
                    checked={
                      selectedAddonIds.find((item) => item === addon.id)
                        ? true
                        : false
                    }
                    onChange={(evt, value) => {
                      if (value) {
                        setSelectedAddonIds([...selectedAddonIds, addon.id]);
                      } else {
                        const selectedIds = selectedAddonIds.filter(
                          (element) => element !== addon.id
                        );
                        setSelectedAddonIds(selectedIds);
                      }
                    }}
                  />
                )
              }
              label={addon.name}
            />
            <Typography sx={{ fontStyle: "italic" }}>{addon.price}</Typography>
          </Box>
        );
      })}
    </Box>
  );
};
