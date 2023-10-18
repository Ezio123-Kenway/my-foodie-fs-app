import { NewTable } from "@/components/NewTable";
import { useAppSelector } from "@/store/hooks";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

const TablesPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const tables = useAppSelector((state) => state.table.items);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          sx={{ width: "fit-content" }}
          onClick={() => setOpen(true)}
        >
          Create table
        </Button>
      </Box>
      {tables.map((table) => (
        <Typography key={table.id}>{table.name}</Typography>
      ))}
      <NewTable open={open} setOpen={setOpen} />
    </Box>
  );
};

export default TablesPage;
