import { useAppSelector } from "@/store/hooks";
import { Box, Chip, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Addons } from "./Addons";

interface Props {
  menuId: number;
  selectedAddonIds: number[];
  setSelectedAddonIds: Dispatch<SetStateAction<number[]>>;
}

export const AddonCategories = ({
  menuId,
  selectedAddonIds,
  setSelectedAddonIds,
}: Props) => {
  const menuAddonCategories = useAppSelector(
    (state) => state.menuAddonCategory.items
  );
  const relatedAddonCategoryIds = menuAddonCategories
    .filter((item) => item.menuId === menuId)
    .map((element) => element.addonCategoryId);
  const relatedAddonCategories = useAppSelector(
    (state) => state.addonCategory.items
  ).filter((item) => relatedAddonCategoryIds.includes(item.id));

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
              selectedAddonIds={selectedAddonIds}
              setSelectedAddonIds={setSelectedAddonIds}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};
