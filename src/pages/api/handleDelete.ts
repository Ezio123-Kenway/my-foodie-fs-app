import { prisma } from "@/utils/db";

export const handleDeleteMenu = async (menuId: number) => {
  const joinedAddonCategory = await prisma.menuAddonCategory.findMany({
    where: { menuId },
  });
  if (joinedAddonCategory.length) {
    const addonCategoryIds = joinedAddonCategory.map(
      (item) => item.addonCategoryId
    );
    addonCategoryIds.forEach(async (addonCategoryId) => {
      console.log("I am inside..");
      const menuAddonCategoryRows = await prisma.menuAddonCategory.findMany({
        where: { addonCategoryId, isArchived: false },
      });
      const canDeleteAddonCategory =
        menuAddonCategoryRows.length === 1 ? true : false;
      if (canDeleteAddonCategory) {
        // one addonCategory is connected to only one menu
        await prisma.addon.updateMany({
          where: { addonCategoryId },
          data: { isArchived: true },
        });
        await prisma.addonCategory.update({
          where: { id: addonCategoryId },
          data: { isArchived: true },
        });
      }

      await prisma.menuAddonCategory.updateMany({
        where: { menuId, addonCategoryId },
        data: { isArchived: true },
      });
      await prisma.menu.update({
        where: { id: menuId },
        data: { isArchived: true },
      });
      console.log("I am here now..");
    });
  } else {
    // the menu has no addon-category connected to it.
    await prisma.menu.update({
      where: { id: menuId },
      data: { isArchived: true },
    });
    console.log("Finally I am here..");
  }
};

export const handleDeleteMenuCategory = async (menuCategoryId: number) => {
  const joinedMenu = await prisma.menuCategoryMenu.findMany({
    where: { menuCategoryId },
  });
  const menuIds = joinedMenu.map((item) => item.menuId);

  menuIds.forEach(async (menuId) => {
    const menuCategoryMenuRows = await prisma.menuCategoryMenu.findMany({
      where: { menuId, isArchived: false },
    });
    console.log("MenuCategoryMenuRows: ", menuCategoryMenuRows);
    const canDeleteMenu = menuCategoryMenuRows.length === 1 ? true : false;
    console.log("canDeleteMenu: ", canDeleteMenu);
    if (canDeleteMenu) {
      console.log("Inside delete..");
      handleDeleteMenu(menuId);
    }

    await prisma.menuCategoryMenu.updateMany({
      where: { menuCategoryId, menuId },
      data: { isArchived: true },
    });
    await prisma.menuCategory.update({
      where: { id: menuCategoryId },
      data: { isArchived: true },
    });
  });
};

// export const handleMenuCategory = async (menuCategoryId: number) => {
//   //get joined Menu ids
//   const joinedMenu = await prisma.menuCategoryMenu.findMany({
//     where: { menuCategoryId },
//   });
//   const menuIds = joinedMenu.map((item) => item.menuId);

//   // check that menus are can delete
//   menuIds.forEach(async (menuId) => {
//     const filterMenu = await prisma.menuCategoryMenu.findMany({
//       where: { menuId, isArchived: false },
//     });

//     const canDeleteMenu = filterMenu.length === 1 ? true : false;
//     if (canDeleteMenu) {
//       handleMenu(menuId);
//     }
//   });

//   //delete in join tabel
//   await prisma.menuCategoryMenu.updateMany({
//     data: { isArchived: true },
//     where: { menuCategoryId },
//   });

//   //delete current menu-category
//   await prisma.menuCategory.update({
//     data: { isArchived: true },
//     where: { id: menuCategoryId },
//   });
// };
