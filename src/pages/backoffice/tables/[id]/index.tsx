import { DeleteMenu } from "@/components/DeleteMenu";
import { DeleteTable } from "@/components/DeleteTable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setOpenSnackbar } from "@/store/slices/snackBarSlice";
import { updateTable } from "@/store/slices/tableSlice";
import { UpdateTableOptions } from "@/types/table";
import { Box, Button, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const TableDetailPage = () => {
  const [updatedTable, setUpdatedTable] = useState<
    UpdateTableOptions | undefined
  >();
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const tableId = Number(router.query.id);
  const tables = useAppSelector((state) => state.table.items);
  const table = tables.find((item) => item.id === tableId);

  useEffect(() => {
    if (table) {
      setUpdatedTable({
        id: table.id,
        name: table.name,
        locationId: table.locationId,
      });
    }
  }, [table]);

  if (!table || !updatedTable) return null;

  const handleUpdateTable = () => {
    dispatch(
      updateTable({
        ...updatedTable,
        onSuccess: () =>
          dispatch(
            setOpenSnackbar({ message: "Updated table successfully.." })
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
          sx={{ width: "100%" }}
          defaultValue={table.name}
          onChange={(evt) =>
            setUpdatedTable({ ...updatedTable, name: evt.target.value })
          }
        ></TextField>
        <Button
          variant="contained"
          color="primary"
          disabled={!updatedTable.name}
          onClick={handleUpdateTable}
          sx={{ mt: 3 }}
        >
          Update
        </Button>
        <DeleteTable open={open} setOpen={setOpen} tableId={tableId} />
      </Box>
    </Box>
  );
};

export default TableDetailPage;
