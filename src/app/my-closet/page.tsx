"use client";
import { useState } from "react";
import { ClothingItem } from "../api/pinecone/types";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Badge,
  Stack,
} from "@mui/material";
import { PineconeResult } from "../pinecone/page";
import CustomSearchInput from "@/client/components/CustomSearchInput";
import CustomDropdown from "@/client/components/CustomDropdown";
import CustomButton from "@/client/components/CustomButton";
import Carousel from "react-material-ui-carousel";

const MyCloset: React.FC = () => {
  const [results, setResults] = useState<PineconeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upsertMessage, setUpsertMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    color: "",
    style: "",
  });

  const handleUpsert = async () => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    setUpsertMessage(null); // Clear the previous upsert message

    const clothingItems: ClothingItem[] = [
      {
        itemId: "blouse_cream_silk",
        category: "clothing",
        subcategory: "blouse",
        color: ["cream"],
        pattern: "",
        fabricMaterial: "silk",
        fabricTexture: ["lightweight"],
        fabricTransparency: "opaque",
        brand: "",
        style: ["elegant"],
        neckline: "high collar",
        closure: ["tie"],
        sleeveLength: "long",
        fit: ["relaxed"],
        embellishments: [],
        detailOther: ["voluminous sleeves"],
        occasion: ["formal", "casual"],
        season: ["spring", "summer"],
        size: "unknown",
        complementaryItems: [],
        personalRating: 0,
        additionalNotes:
          "This elegant blouse features a high collar with a tie closure and long, voluminous sleeves. The fabric appears to be lightweight and drapes beautifully.",
      },
      {
        itemId: "blouse_white_silk",
        category: "clothing",
        subcategory: "blouse",
        color: ["white"],
        pattern: "",
        fabricMaterial: "silk",
        fabricTexture: ["smooth"],
        fabricTransparency: "opaque",
        brand: "",
        style: ["classic"],
        neckline: "Mandarin collar",
        closure: ["button-front"],
        sleeveLength: "long",
        fit: ["relaxed"],
        embellishments: [],
        detailOther: ["subtle sheen"],
        occasion: ["formal", "casual"],
        season: ["spring", "summer"],
        size: "unknown",
        complementaryItems: [],
        personalRating: 0,
        additionalNotes:
          "This classic blouse has a Mandarin collar and a button-front closure. The silk fabric has a subtle sheen, giving it a luxurious look.",
      },
    ];

    try {
      const response = await fetch("/api/pinecone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "upsert", data: clothingItems }), // Send the array of items
      });

      if (!response.ok) {
        throw new Error(`Error upserting to Pinecone: ${response.statusText}`);
      }

      const data = await response.json();
      setUpsertMessage(data.message);
    } catch (err) {
      setError("An error occurred while adding the items.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/pinecone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "query",
          data: { query, filter: filters },
        }),
      });

      if (!response.ok) {
        throw new Error("Error querying Pinecone");
      }

      const data = (await response.json()) as PineconeResult;
      setResults(data);
    } catch (err) {
      setError("An error occurred while querying.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
  };

  // Options for the filters
  const categoryOptions = [
    { value: "", label: "All Categories" },
    { value: "clothing", label: "Clothing" },
    { value: "accessory", label: "Accessory" },
  ];

  const colorOptions = [
    { value: "", label: "All Colors" },
    { value: "red", label: "Red" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "cream", label: "Cream" },
    // ... add more colors as needed
  ];

  const styleOptions = [
    { value: "", label: "All Styles" },
    { value: "casual", label: "Casual" },
    { value: "formal", label: "Formal" },
    { value: "sporty", label: "Sporty" },
    { value: "elegant", label: "Elegant" },
    // ... add more styles as needed
  ];

  return (
    <Container maxWidth="md">
      {" "}
      {/* Center content */}
      <Box className="container mx-auto p-4" p={4}>
        <Typography variant="h5" component="h1" gutterBottom>
          Explore My Wardrobe
        </Typography>

        {/* Upsert Section */}
        {/* <Box mb={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpsert}
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Sample Blouse"}
        </Button>
        {upsertMessage && (
          <Typography variant="body1" color="primary" mt={1}>
            {upsertMessage}
          </Typography>
        )}
      </Box> */}

        {/* Search Section */}
        {/* <Typography variant="h4" component="h1" gutterBottom>
                Search Your Closet
            </Typography> */}
        <Box mt={4} display="flex" alignItems="center">
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomSearchInput
                  label="search your wardrobe"
                  placeholder="Enter your query (e.g., 'red dress')"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomDropdown
                  label="category"
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  options={categoryOptions}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomDropdown
                  label="color"
                  value={filters.color}
                  onChange={(e) => handleFilterChange("color", e.target.value)}
                  options={colorOptions}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomDropdown
                  label="style"
                  value={filters.style}
                  onChange={(e) => handleFilterChange("style", e.target.value)}
                  options={styleOptions}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomButton
                  type="submit"
                  color="customBlack"
                  disabled={isLoading}
                >
                  {isLoading ? "Searching..." : "Search"}
                </CustomButton>
              </Grid>
            </Grid>
          </form>
        </Box>

        {/* Results Section (Carousel) */}
        {isLoading ? (
          <Box mt={4} display="flex" alignItems="center">
            <CircularProgress color="warning" />
            <Typography variant="body1" ml={2}>
              Searching...
            </Typography>
          </Box>
        ) : error ? (
          <Typography variant="body1" color="error" mt={2}>
            {error}
          </Typography>
        ) : results && results.matches.length > 0 ? (
          <Box
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <Carousel
              autoPlay={true}
              // navButtonsAlwaysVisible
              animation="slide"
              fullHeightHover={false}
              sx={{
                width: "40%",

                "& .MuiCard-root": {
                  backgroundColor: "#f5f5f5",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                },
                "& .MuiIconButton-root": {
                  color: "#333",
                  fontSize: "2rem",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                  },
                },
                "& .MuiCarousel-indicators": {
                  position: "absolute",
                  bottom: 10,
                  left: "50%",
                  transform: "translateX(-50%)",
                },
                "& .MuiCarousel-indicator": {
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                },
              }}
            >
              {results.matches.map((match, index) => (
                <Card
                  className="transform hover:scale-105 transition-transform duration-300 shadow-md"
                  key={index}
                >
                  {/* <CardMedia
                                     component="img"
                                     alt={match.metadata.itemId}
                                     image={"imageUrl" in match.metadata ? match.metadata.imageUrl : "/placeholder.jpg"}
                                     height="250" // Optional fixed height for image consistency
                                   /> */}
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={1}
                      mb={2}
                    >
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          "&::first-letter": { textTransform: "capitalize" },
                        }}
                      >
                        {match.metadata.subcategory}
                      </Typography>

                      {match.metadata.brand && (
                        <Badge
                          badgeContent={match.metadata.brand}
                          color="warning"
                          sx={{
                            // Apply styles to the badge itself
                            "& .MuiBadge-badge": {
                              // Target the badge content specifically
                              textTransform: "capitalize",
                            },
                          }}
                        />
                      )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {match.metadata.additionalNotes}
                    </Typography>
                    {/* Display Tags */}
                    <Box mt={1}>
                      {match.metadata.style.map((style) => (
                        <Chip
                          key={style}
                          label={style}
                          size="small"
                          className="mr-1"
                        />
                      ))}
                      {match.metadata.color.map((color) => (
                        <Chip
                          key={color}
                          label={color}
                          size="small"
                          className="mr-1"
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Carousel>
          </Box>
        ) : (
          <Typography variant="body1" mt={2}>
            No results found.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default MyCloset;
