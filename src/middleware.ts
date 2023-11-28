export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/api/app",
    "/api/addon-categories",
    "/api/addons",
    "/api/assets",
    "/api/auth",
    "/api/company",
    "/api/locations",
    "/api/menu-categories",
    "/api/menus",
    "/api/tables",
  ],
};
