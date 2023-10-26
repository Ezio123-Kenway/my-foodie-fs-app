type Severity = "success" | "error";

export interface SnackBarSlice {
  open: boolean;
  message: string | null;
  autoHideDuration: number;
  severity: Severity;
}
