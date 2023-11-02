import { ItemCard } from "@/components/ItemCard";
import { NewTable } from "@/components/NewTable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import TableBarIcon from "@mui/icons-material/TableBar";
import { Box, Button } from "@mui/material";
import { Table } from "@prisma/client";
import { useState } from "react";

const TablesPage = () => {
  const [open, setOpen] = useState(false);
  const tables = useAppSelector((state) => state.table.items);
  const [selectedTables, setSelectedTables] = useState<Table[]>([]);
  const dispatch = useAppDispatch();

  if (!selectedTables.length) return null;
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New table
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {tables.map((item) => (
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
