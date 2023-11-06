import { Box } from "@mui/material";

interface Props {
  children: string | JSX.Element | JSX.Element[];
}

export const OrderLayout = ({ children }: Props) => {
  return <Box>{children}</Box>;
};
