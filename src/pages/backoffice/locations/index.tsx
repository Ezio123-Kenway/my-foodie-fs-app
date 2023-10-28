import { ItemCard } from "@/components/ItemCard";
import { NewLocation } from "@/components/NewLocation";
import { useAppSelector } from "@/store/hooks";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

const LocationsPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const locations = useAppSelector((state) => state.location.items);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          sx={{ width: "fit-content" }}
          onClick={() => setOpen(true)}
        >
          Create location
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {locations.map((location) => (
            <ItemCard
              href={`/backoffice/locations/${location.id}`}
              key={location.id}
              title={location.name}
              icon={<LocationOnIcon />}
            />
          ))}
        </Box>
      </Box>
      <NewLocation open={open} setOpen={setOpen} />
    </Box>
  );
};

export default LocationsPage;
