import { ItemCard } from "@/components/ItemCard";
import { NewLocation } from "@/components/NewLocation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedLocation } from "@/store/slices/locationSlice";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

const LocationsPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { items: locations, selectedLocation } = useAppSelector(
    (state) => state.location
  );
  const dispatch = useAppDispatch();

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
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        {locations.map((location) => (
          <ItemCard
            key={location.id}
            title={location.name}
            icon={<LocationOnIcon />}
            selected={location.id === selectedLocation?.id}
            handleSelectLocation={() => {
              dispatch(setSelectedLocation(location));
              localStorage.setItem("selectedLocationId", String(location.id));
            }}
          />
        ))}
      </Box>
      <NewLocation open={open} setOpen={setOpen} />
    </Box>
  );
};

export default LocationsPage;
