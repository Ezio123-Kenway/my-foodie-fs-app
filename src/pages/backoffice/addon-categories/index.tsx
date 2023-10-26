import { NewAddonCategory } from "@/components/NewAddonCategory";
import { useAppSelector } from "@/store/hooks";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import ClassIcon from "@mui/icons-material/Class";
import { ItemCard } from "@/components/ItemCard";

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
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {addonCategories.map((addonCategory) => (
          <ItemCard
            key={addonCategory.id}
            icon={<ClassIcon />}
            title={addonCategory.name}
            href={`/backoffice/addon-categories/${addonCategory.id}`}
          />
        ))}
      </Box>
      <NewAddonCategory open={open} setOpen={setOpen} />
    </Box>
  );
};

export default AddonCategoriesPage;
