import { Box, Button, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import logo from "../assets/logo.png";
import Image from "next/image";

export const Topbar = () => {
  const { data } = useSession();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 2,
        backgroundColor: "success.main",
      }}
    >
      <Box sx={{ height: 70 }}>
        <Image
          src={logo}
          alt="logo"
          style={{ width: "100%", height: "100%" }}
        />
      </Box>
      <Typography variant="h5" color={"secondary"}>
        Foodie POS
      </Typography>
      <Box>
        {data ? (
          <Button
            variant="contained"
            sx={{ width: "fit-content", backgroundColor: "primary.main" }}
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign Out
          </Button>
        ) : (
          <span />
        )}
      </Box>
    </Box>
  );
};
