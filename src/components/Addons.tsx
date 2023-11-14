import { useAppSelector } from "@/store/hooks";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import { Addon } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

interface Props {
  addonCategoryId: number;
  selectedAddons: Addon[];
  setSelectedAddons: Dispatch<SetStateAction<Addon[]>>;
}

export const Addons = ({
  addonCategoryId,
  selectedAddons,
  setSelectedAddons,
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
                      selectedAddons.find((item) => item.id === addon.id)
                        ? true
                        : false
                    }
                    onChange={() => {
                      const relatedAddonIds = relatedAddons.map(
                        (item) => item.id
                      );
                      const others = selectedAddons.filter(
                        (item) => !relatedAddonIds.includes(item.id)
                      );
                      setSelectedAddons([...others, addon]);
                    }}
                  />
                ) : (
                  <Checkbox
                    color="success"
                    checked={
                      selectedAddons.find((item) => item.id === addon.id)
                        ? true
                        : false
                    }
                    onChange={(evt, value) => {
                      if (value) {
                        setSelectedAddons([...selectedAddons, addon]);
                      } else {
                        const selected = selectedAddons.filter(
                          (element) => element.id !== addon.id
                        );
                        setSelectedAddons(selected);
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
