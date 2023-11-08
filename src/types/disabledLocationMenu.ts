import { DisabledLocationMenu } from "@prisma/client";

export interface DisabledLocationMenuSlice {
  items: DisabledLocationMenu[];
  isLoading: boolean;
  error: Error | null;
}
