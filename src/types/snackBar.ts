type SnackbarSeverity = "success" | "error";

export interface SnackBarSlice {
  message: string | null;
  autoHideDuration: number;
  open: boolean;
  severity: SnackbarSeverity;
}
