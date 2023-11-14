import MenuCard from "@/components/MenuCard";
import { useAppSelector } from "@/store/hooks";
import { Box, Tabs, Tab } from "@mui/material";
import { MenuCategory } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const OrderApp = () => {
  const { isReady, ...router } = useRouter();
  const query = router.query;
  const tableId = query.tableId as string;
  const [value, setValue] = useState<number>(0);
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<
    MenuCategory | undefined
  >();
  const menuCategories = useAppSelector((state) => state.menuCategory.items);
  const menuCategoryMenus = useAppSelector(
    (state) => state.menuCategoryMenu.items
  );
  const menus = useAppSelector((state) => state.menu.items);

  useEffect(() => {
    if (menuCategories.length) {
      setSelectedMenuCategory(menuCategories[0]);
    }
  }, [menuCategories]);

  useEffect(() => {
    if (isReady && !tableId) {
      router.push("/");
    }
  }, [isReady]);

  const renderMenus = () => {
    const validMenuIds = menuCategoryMenus
      .filter((item) => item.menuCategoryId === selectedMenuCategory?.id)
      .map((element) => element.menuId);
    const validMenus = menus.filter((menu) => validMenuIds.includes(menu.id));
    return validMenus.map((item) => {
      const href = { pathname: `/order/menus/${item.id}`, query };
      return <MenuCard key={item.id} menu={item} href={href} />;
    });
  };

  return (
    <Box sx={{ position: "relative", zIndex: 5 }}>
      <Box>
        <Tabs
          TabIndicatorProps={{ style: { background: "#1B9C85" } }}
          value={value}
          onChange={(evt, value) => setValue(value)}
          variant="scrollable"
          sx={{ ".Mui-selected": { color: "#1B9C85", fontWeight: "bold" } }}
        >
          {menuCategories.map((menuCategory) => {
            return (
              <Tab
                key={menuCategory.id}
                label={menuCategory.name}
                sx={{ color: "#4C4C6D" }}
                onClick={() => setSelectedMenuCategory(menuCategory)}
              />
            );
          })}
        </Tabs>
      </Box>
      <Box sx={{ pt: 2, display: "flex" }}>{renderMenus()}</Box>
    </Box>
  );
};

export default OrderApp;
