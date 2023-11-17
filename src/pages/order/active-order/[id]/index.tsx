import { Box } from "@mui/material";
import { useRouter } from "next/router";

const ActiveOrder = () => {
  const router = useRouter();
  const orderSeq = router.query.id;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        p: 3,
        bgcolor: "#E8F6EF",
        borderRadius: 15,
        mx: 3,
        position: "relative",
        top: 150,
        zIndex: 5,
      }}
    >
      OrderSeq: {orderSeq}
    </Box>
  );
};

export default ActiveOrder;
