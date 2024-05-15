"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import Box from "@mui/material/Box";
import { usePathname } from "next/navigation";

const links = [
  { label: "Video Onboard", href: "/" },
  { label: "Celebrity Style Analyzer", href: "/celebrity-style" },
  // { label: "LLM Input Combiner", href: "/llm-combiner" },
  { label: "8 Ways to Dress like Celeb X", href: "/dress-like-celeb" },
  { label: "Capsule for Profession X", href: "/capsule-profession" },
  { label: "Celeb Comparison Report", href: "/celeb-comparison-report" },
  { label: "New Item Recommendations", href: "/recommendation-new-item" },
  { label: "Accessory Recommendations", href: "/recommendation-accessory" },
  { label: "Outfit Recommendations for Occasion X", href: "/recommendation-outfit-occasion" },
  { label: "Outfit Recommendations for Vacation", href: "/recommendation-outfit-vacation" },

];

const linksPerRow = 5; // Number of links to show initially

export default function Navbar() {
  const [showMore, setShowMore] = React.useState(false);
  const pathname = usePathname();
  const visibleLinks = showMore ? links : links.slice(0, linksPerRow);

  const handleShowMoreClick = () => {
    setShowMore(!showMore);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "black" }}>
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Glamhive AI
          </Typography> */}
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {" "}
            {/* Wrap links */}
            {visibleLinks.map((link) => (
              <Link key={link.href} href={link.href} passHref legacyBehavior>
                <Button
                  color={pathname === link.href ? "warning" : "inherit"}
                  sx={{
                    m: 0.5,
                    borderLeft: "1px solid white",
                    "&:first-of-type": { borderLeft: "none" }, // Remove border on first link
                  }}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </Box>

          {links.length > linksPerRow && (
            <Button
              color="inherit"
              onClick={handleShowMoreClick}
              sx={{ marginLeft: "auto", whiteSpace: "nowrap" }}
            >
              {showMore ? "Show Less" : "Show More"}
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
