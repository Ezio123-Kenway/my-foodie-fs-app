import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetSnackbar, setOpenSnackbar } from "@/store/slices/snackBarSlice";
import { Alert, Snackbar as MuiSnackBar } from "@mui/material";

export const Snackbar = () => {
  const { open, autoHideDuration, message, severity } = useAppSelector(
    (state) => state.snackBar
  );
  const dispatch = useAppDispatch();
  setTimeout(() => {
    dispatch(resetSnackbar());
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
