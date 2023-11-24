import { ItemCard } from "@/components/ItemCard";
import { NewAddon } from "@/components/NewAddon";
import { useAppSelector } from "@/store/hooks";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import EggIcon from "@mui/icons-material/Egg";

const AddonsPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const addons = useAppSelector((state) => state.addon.items);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          sx={{ width: "fit-content" }}
          onClick={() => setOpen(true)}
        >
          Create addon
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        {addons.map((addon) => (
          <ItemCard
            href={`/backoffice/addons/${addon.id}`}
            key={addon.id}
            title={addon.name}
            icon={<EggIcon />}
          />
        ))}
      </Box>
      <NewAddon open={open} setOpen={setOpen} />
    </Box>
  );
};

export default AddonsPage;
