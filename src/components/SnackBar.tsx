import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetSnackBar } from "@/store/slices/snackBarSlice";
import { Snackbar as MuiSnackBar, Alert } from "@mui/material";

export const SnackBar = () => {
  const { open, message, autoHideDuration, severity } = useAppSelector(
    (state) => state.snackBar
  );
  const dispatch = useAppDispatch();
  setTimeout(() => {
    dispatch(resetSnackBar());
  }, autoHideDuration);

  return (
    <MuiSnackBar
      open={open}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </MuiSnackBar>
  );
};
