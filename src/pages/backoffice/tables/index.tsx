import { ItemCard } from "@/components/ItemCard";
import { NewTable } from "@/components/NewTable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTablesByLocationId } from "@/store/slices/tableSlice";
import TableBarIcon from "@mui/icons-material/TableBar";
import { Box, Button } from "@mui/material";
import { Table } from "@prisma/client";
import { useEffect, useState } from "react";

const TablesPage = () => {
  const [open, setOpen] = useState(false);
  const tables = useAppSelector((state) => state.table.items);
  const [selectedTables, setSelectedTables] = useState<Table[]>([]);

  useEffect(() => {
    if (tables) {
      const locationId = Number(localStorage.getItem("selectedLocationId"));
      const filteredTables = tables.filter(
        (table) => table.locationId === locationId
      );
      setSelectedTables(filteredTables);
    }
  }, [tables]);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New table
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {selectedTables.length > 0 &&
          selectedTables.map((item) => (
            <ItemCard
              href={`/backoffice/tables/${item.id}`}
              icon={<TableBarIcon />}
              key={item.id}
              title={item.name}
            />
          ))}
      </Box>
      <NewTable open={open} setOpen={setOpen} />
    </Box>
  );
};

export default TablesPage;
