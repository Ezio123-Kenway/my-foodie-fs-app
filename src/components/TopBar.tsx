import { Box, Button, Drawer, IconButton, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import logo from "../assets/logo.png";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import SideBar from "./SideBar";

export const Topbar = () => {
  const { data } = useSession();
  const { selectedLocation } = useAppSelector((state) => state.location);
  const [open, setOpen] = useState<boolean>(false);
  const showLocation = data && selectedLocation;

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
        {showLocation && (
          <Typography color={"secondary"} sx={{ fontSize: 13 }}>
            ({selectedLocation?.name})
          </Typography>
        )}
      </Box>
      <Box>
        {data ? (
          <Box>
            <IconButton
              sx={{ display: { xs: "block", sm: "none" } }}
              onClick={() => setOpen(true)}
            >
              <MenuIcon
                sx={{
                  fontSize: "30px",
                  color: "#E8F6EF",
                }}
              />
            </IconButton>
            <Button
              variant="contained"
              sx={{
                width: "fit-content",
                backgroundColor: "primary.main",
                display: { xs: "none", sm: "block" },
              }}
              onClick={() => signOut({ callbackUrl: "/backoffice" })}
            >
              Sign Out
            </Button>
          </Box>
        ) : (
          <span />
        )}
        <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
          <SideBar />
        </Drawer>
      </Box>
    </Box>
  );
};
