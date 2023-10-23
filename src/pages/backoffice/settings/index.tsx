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
  const locations = useAppSelector((state) => state.location.items);
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");

  const handleLocationChange = (evt: SelectChangeEvent<number>) => {
    const id = evt.target.value as number;
    localStorage.setItem("selectedLocationId", String(id));
    setSelectedLocationId(String(id));
  };

  useEffect(() => {
    if (locations.length) {
      const selectedLocationId = localStorage.getItem("selectedLocationId");
      if (selectedLocationId) {
        setSelectedLocationId(selectedLocationId);
      } else {
        const firstLocationId = locations[0].id;
        setSelectedLocationId(String(firstLocationId));
      }
    }
  }, [locations]);

  if (!selectedLocationId) return null;

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel>Location</InputLabel>
        <Select
          value={Number(selectedLocationId)}
          label="Location"
          onChange={handleLocationChange}
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
