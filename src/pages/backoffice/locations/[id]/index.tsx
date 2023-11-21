import { DeleteLocation } from "@/components/DeleteLocation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateLocation } from "@/store/slices/locationSlice";
import { setOpenSnackbar } from "@/store/slices/snackBarSlice";
import { UpdateLocationOptions } from "@/types/location";
import { Box, Button, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const LocationDetailPage = () => {
  const [updatedLocation, setUpdatedLocation] = useState<
    UpdateLocationOptions | undefined
  >();
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const locationId = Number(router.query.id);
  const locations = useAppSelector((state) => state.location.items);
  const location = locations.find((item) => item.id === locationId);

  useEffect(() => {
    if (location) {
      setUpdatedLocation({
        id: location.id,
        name: location.name,
        street: location.street,
        township: location.township,
        city: location.city,
        companyId: location.companyId,
      });
    }
  }, [location]);

  if (!location || !updatedLocation) return null;

  const canUpdate =
    updatedLocation.name &&
    updatedLocation.street &&
    updatedLocation.township &&
    updatedLocation.city;

  const handleUpdateLocation = () => {
    dispatch(
      updateLocation({
        ...updatedLocation,
        onSuccess: () =>
          dispatch(
            setOpenSnackbar({ message: "Updated location successfully.." })
          ),
      })
    );
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Delete
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          variant="outlined"
          type="string"
          sx={{ width: "100%", mb: 3 }}
          defaultValue={location.name}
          onChange={(evt) =>
            setUpdatedLocation({ ...updatedLocation, name: evt.target.value })
          }
        ></TextField>
        <TextField
          variant="outlined"
          type="string"
          sx={{ width: "100%", my: 3 }}
          defaultValue={location.street}
          onChange={(evt) =>
            setUpdatedLocation({
              ...updatedLocation,
              street: evt.target.value,
            })
          }
        ></TextField>
        <TextField
          variant="outlined"
          type="string"
          sx={{ width: "100%", my: 3 }}
          defaultValue={location.township}
          onChange={(evt) =>
            setUpdatedLocation({
              ...updatedLocation,
              township: evt.target.value,
            })
          }
        ></TextField>
        <TextField
          variant="outlined"
          type="string"
          sx={{ width: "100%", my: 3 }}
          defaultValue={location.city}
          onChange={(evt) =>
            setUpdatedLocation({
              ...updatedLocation,
              city: evt.target.value,
            })
          }
        ></TextField>
        <Button
          variant="contained"
          color="primary"
          disabled={!canUpdate}
          onClick={handleUpdateLocation}
          sx={{ mt: 3, width: "fit-content" }}
        >
          Update
        </Button>
        <DeleteLocation open={open} setOpen={setOpen} locationId={locationId} />
      </Box>
    </Box>
  );
};

export default LocationDetailPage;
