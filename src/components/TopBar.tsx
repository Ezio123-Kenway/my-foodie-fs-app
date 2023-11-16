import { Box, Button, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import logo from "../assets/logo.png";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";

export const Topbar = () => {
  const { data } = useSession();
  const { selectedLocation } = useAppSelector((state) => state.location);

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" color={"secondary"}>
          Foodie POS
        </Typography>
        <Typography color={"secondary"} sx={{ fontSize: 13 }}>
          ({selectedLocation && selectedLocation.name})
        </Typography>
      </Box>
      <Box>
        {data ? (
          <Button
            variant="contained"
            sx={{ width: "fit-content", backgroundColor: "primary.main" }}
            onClick={() => signOut({ callbackUrl: "/backoffice" })}
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
