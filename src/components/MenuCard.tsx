import PaidIcon from "@mui/icons-material/Paid";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Menu } from "@prisma/client";
import Link from "next/link";

interface Props {
  menu: Menu;
  href: string | object;
  isAvailable?: boolean;
}

const MenuCard = ({ menu, href, isAvailable }: Props) => {
  return (
    <Link
      key={menu.id}
      href={href}
      style={{
        textDecoration: "none",
        marginRight: "15px",
        marginBottom: "20px",
      }}
    >
      <Card
        sx={{
          width: 200,
          height: 220,
          pb: 2,
          opacity: isAvailable === false ? 0.4 : 1,
        }}
      >
        <CardMedia
          sx={{ height: 140 }}
          image={menu.imageUrl || "/default-menu.png"}
          component={"div"}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" sx={{ mb: 0 }}>
            {menu.name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <PaidIcon color="success" />
            <Typography
              gutterBottom
              variant="subtitle1"
              sx={{ mt: 0.8, ml: 0.4, fontWeight: "bold", fontStyle: "italic" }}
            >
              {menu.price}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MenuCard;
