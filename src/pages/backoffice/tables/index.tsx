import { ItemCard } from "@/components/ItemCard";
import { NewTable } from "@/components/NewTable";
import { useAppSelector } from "@/store/hooks";
import TableBarIcon from "@mui/icons-material/TableBar";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const TablesPage = () => {
  const [open, setOpen] = useState(false);
  const tables = useAppSelector((state) => state.table.items);

  const handleQRImagePrint = (assetUrl: string) => {
    const imageWindow = window.open("");
    imageWindow?.document.write(
      `<html><head><title>Print Image</title></head><body style="text-align: center;"><img src="${assetUrl}" onload="window.print();window.close()" /></body></html>`
    );
    imageWindow?.document.close();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New table
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {tables.map((item) => (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            key={item.id}
          >
            <ItemCard
              href={`/backoffice/tables/${item.id}`}
              icon={<TableBarIcon />}
              title={item.name}
            />
            <Button
              variant="contained"
              onClick={() => handleQRImagePrint(item.assetUrl)}
            >
              PRINT QR
            </Button>
          </Box>
        ))}
      </Box>
      <NewTable open={open} setOpen={setOpen} />
    </Box>
  );
};

export default TablesPage;
