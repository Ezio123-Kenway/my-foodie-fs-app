import { useAppSelector } from "@/store/hooks";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";

const SettingsPage = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const locations = useAppSelector((state) => state.location.items);
  // console.log("selectedLocationId", selectedLocationId);

  useEffect(() => {
    if (locations.length) {
      const currentLocationId = localStorage.getItem("selectedLocationId");
      if (!currentLocationId) {
        const firstLocationId = String(locations[0].id);
        setSelectedLocationId(firstLocationId);
      } else {
        setSelectedLocationId(currentLocationId);
      }
    }
  }, [locations]);

  // const handleLocationChange = (evt: SelectChangeEvent<number>) => {
  //   localStorage.setItem("selectedLocationId", String(evt.target.value));
  // };

  if (!selectedLocationId) return null;

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel>Location</InputLabel>
        <Select
          value={selectedLocationId}
          label="Location"
          onChange={(evt) => {
            const id = evt.target.value;
            localStorage.setItem("selectedLocationId", id);
            setSelectedLocationId(id);
          }}
        >
          {locations.map((location) => (
            <MenuItem key={location.id} value={location.id}>
              {location.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SettingsPage;
