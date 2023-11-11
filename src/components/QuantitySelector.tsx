import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";

interface Props {
  quantity: number;
  handleDecreaseQuantity: () => void;
  handleIncreaseQuantity: () => void;
}

export const QuantitySelector = ({
  quantity,
  handleDecreaseQuantity,
  handleIncreaseQuantity,
}: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "100px",
        mt: 5,
      }}
    >
      <IconButton onClick={handleDecreaseQuantity} color="primary">
        <RemoveCircle />
      </IconButton>
      <Typography variant="h5">{quantity}</Typography>
      <IconButton onClick={handleIncreaseQuantity} color="primary">
        <AddCircle />
      </IconButton>
    </Box>
  );
};
