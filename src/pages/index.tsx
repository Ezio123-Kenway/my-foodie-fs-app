import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";

export default function Home() {
  const [value, setValue] = useState<number>(1);
  console.log("rendered");

  useEffect(() => {
    setValue(1);
    console.log("Inside");
  }, [value]);

  return (
    <Box>
      <h5>{value}</h5>
      <Button variant="contained" onClick={() => setValue(1)}>
        Click
      </Button>
    </Box>
  );
}
