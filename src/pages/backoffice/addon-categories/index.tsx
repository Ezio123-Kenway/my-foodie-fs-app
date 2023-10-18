import { NewAddonCategory } from "@/components/NewAddonCategory";
import { useAppSelector } from "@/store/hooks";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

const AddonCategoriesPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const addonCategories = useAppSelector((state) => state.addonCategory.items);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          sx={{ width: "fit-content" }}
          onClick={() => setOpen(true)}
        >
          Create addon category
        </Button>
      </Box>
      {addonCategories.map((addonCategory) => (
        <Typography key={addonCategory.id}>{addonCategory.name}</Typography>
      ))}
      <NewAddonCategory open={open} setOpen={setOpen} />
    </Box>
  );
};

export default AddonCategoriesPage;
