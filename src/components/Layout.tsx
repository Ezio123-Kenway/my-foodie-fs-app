import { Box } from "@mui/material";
import { ReactNode, useEffect } from "react";
import { Topbar } from "./TopBar";
import SideBar from "./SideBar";
import { config } from "@/utils/config";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";

interface Props {
  children: ReactNode;
}

const fetchData = async () => {
  const response = await fetch(`${config.apiBaseUrl}/app`);
  const dataFromServer = await response.json();
  console.log("dataFromServer: ", dataFromServer);
};

export const Layout = ({ children }: Props) => {
  const { data } = useSession();
  const dispatch = useAppDispatch();
  const { init } = useAppSelector((state) => state.app);

  useEffect(() => {
    if (data && !init) {
      dispatch(fetchAppData({}));
    }
  }, [data]);

  return (
    <Box>
      <Topbar />
      <Box sx={{ display: "flex", position: "relative", zIndex: 5, flex: 1 }}>
        {data && <SideBar />}
        <Box sx={{ p: 3, width: "100%", height: "100%" }}>{children}</Box>
      </Box>
    </Box>
  );
};
