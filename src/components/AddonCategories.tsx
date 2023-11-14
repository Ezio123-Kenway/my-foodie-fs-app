import { useAppSelector } from "@/store/hooks";
import { Box, Chip, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Addons } from "./Addons";
import { Addon, AddonCategory } from "@prisma/client";

interface Props {
  relatedAddonCategories: AddonCategory[];
  selectedAddons: Addon[];
  setSelectedAddons: Dispatch<SetStateAction<Addon[]>>;
}

export const AddonCategories = ({
  relatedAddonCategories,
  selectedAddons,
  setSelectedAddons,
}: Props) => {
  return (
    <Box>
      {relatedAddonCategories.map((addonCategory) => (
        <Box key={addonCategory.id} sx={{ mb: 5 }}>
          <Box
            sx={{
              display: "flex",
              width: "300px",
              justifyContent: "space-between",
            }}
          >
            <Typography>{addonCategory.name}</Typography>
            <Chip label={addonCategory.isRequired ? "Required" : "Optional"} />
          </Box>
          <Box sx={{ pl: 1, mt: 2 }}>
            <Addons
              addonCategoryId={addonCategory.id}
              selectedAddons={selectedAddons}
              setSelectedAddons={setSelectedAddons}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};
