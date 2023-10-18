import { NewLocation } from "@/components/NewLocation";
import { useAppSelector } from "@/store/hooks";

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
      {locations.map((location) => (
        <Typography key={location.id}>{location.name}</Typography>
      ))}
      <NewLocation open={open} setOpen={setOpen} />
    </Box>
  );
};

export default LocationsPage;
