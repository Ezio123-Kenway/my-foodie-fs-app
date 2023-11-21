import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateCompany } from "@/store/slices/companySlice";
import { setOpenSnackbar } from "@/store/slices/snackBarSlice";
import { UpdateCompanyOptions } from "@/types/company";
import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const SettingsPage = () => {
  const [updatedCompany, setUpdatedCompany] = useState<
    UpdateCompanyOptions | undefined
  >();
  const dispatch = useAppDispatch();
  const company = useAppSelector((state) => state.company.item);

  useEffect(() => {
    if (company) {
      setUpdatedCompany({
        id: company.id,
        name: company.name,
        street: company.street,
        township: company.township,
        city: company.city,
      });
    }
  }, [company]);

  if (!company || !updatedCompany) return null;

  const handleUpdateCompany = () => {
    dispatch(
      updateCompany({
        ...updatedCompany,
        onSuccess: () =>
          dispatch(
            setOpenSnackbar({ message: "Updated company successfully.." })
          ),
      })
    );
  };

  return (
    <Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          variant="outlined"
          type="string"
          sx={{ width: "100%" }}
          defaultValue={company.name}
          onChange={(evt) =>
            setUpdatedCompany({ ...updatedCompany, name: evt.target.value })
          }
        ></TextField>
        <TextField
          variant="outlined"
          type="string"
          sx={{ width: "100%", mt: 4 }}
          defaultValue={company.street}
          onChange={(evt) =>
            setUpdatedCompany({ ...updatedCompany, street: evt.target.value })
          }
        ></TextField>
        <TextField
          variant="outlined"
          type="string"
          sx={{ width: "100%", mt: 4 }}
          defaultValue={company.township}
          onChange={(evt) =>
            setUpdatedCompany({ ...updatedCompany, township: evt.target.value })
          }
        ></TextField>
        <TextField
          variant="outlined"
          type="string"
          sx={{ width: "100%", mt: 4 }}
          defaultValue={company.city}
          onChange={(evt) =>
            setUpdatedCompany({ ...updatedCompany, city: evt.target.value })
          }
        ></TextField>
        <Button
          variant="contained"
          color="primary"
          disabled={
            !updatedCompany.name ||
            !updatedCompany.street ||
            !updatedCompany.township ||
            !updatedCompany.city
          }
          onClick={handleUpdateCompany}
          sx={{ mt: 3, width: "fit-content" }}
        >
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage;
