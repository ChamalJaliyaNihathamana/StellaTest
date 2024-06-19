"use client";
import { useEffect, useState } from "react";
import { AccessoryItem, ClothingItem } from "../api/pinecone/types";
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { setExistingWardrobe } from "@/lib/features/user-profile/userProfileSlice";
import { entityExtractionWardrobePrompt } from "@/client/prompts/entityExtractionWardrobePrompt";

const MyCloset: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [rawWardrobeData, setRawWardrobeData] = useState(
    "Cream-colored silk blouse: This elegant blouse features a high collar with a tie closure and long, voluminous sleeves. The fabric appears to be lightweight and drapes beautifully. White silk blouse: This classic blouse has a Mandarin collar and a button-front closure. The silk fabric has a subtle sheen, giving it a luxurious look. Pink silk skirt: This delicate skirt appears to be made of a lightweight silk fabric with a subtle sheen. It has a relaxed fit and falls to about knee length. Light pink ruffled blouse: This romantic blouse is crafted from a sheer, lightweight fabric and features delicate ruffles along the neckline and sleeves. The soft pink color adds a feminine touch."
  );
  const [results, setResults] = useState<PineconeResult | null>(null);
  const [filteredItems, setFilteredItems] = useState<
    (ClothingItem | AccessoryItem)[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upsertMessage, setUpsertMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    color: "",
    style: "",
  });

  const { existingWardrobe } = useSelector(
    (state: RootState) => state.userProfile
  );
  useEffect(() => {
    const fetchWardrobeData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/pinecone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            method: "query",
            data: {
              query: "Describe the user's existing wardrobe",
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage =
            errorData?.error || "Error fetching wardrobe data";
          throw new Error(errorMessage);
        }

        const data: PineconeResult = await response.json();
        console.log("Fetched Pinecone data:", data);

        // Extract ClothingItem or AccessoryItem objects from metadata
        const wardrobeItems = data.matches.map(
          (match) => match.metadata as ClothingItem | AccessoryItem
        );

        dispatch(setExistingWardrobe(wardrobeItems)); // Update Redux
        setFilteredItems(wardrobeItems);
        setResults(data); // Update component state for initial display
      } catch (err: any) {
        setError(
          err.message || "An error occurred while fetching wardrobe data."
        );
        console.error("Error details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWardrobeData();
  }, [dispatch]);

  const handleUpsert = async () => {
    setIsLoading(true);
    setError(null);
    setUpsertMessage(null);

    try {
      // 1. Extract Item Data from Raw Input
      const extractedItems = await entityExtractionWardrobePrompt(
        rawWardrobeData
      );

      // 2. Check if Extraction Was Successful
      if (extractedItems.length === 0) {
        throw new Error("No wardrobe items could be extracted from the input.");
      }

      // 3. Upsert to Pinecone
      const response = await fetch("/api/pinecone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "upsert", data: extractedItems }),
      });

      // 4. Handle the Response
      if (response.ok) {
        const data = await response.json();
        setUpsertMessage(data.message || "Items upserted successfully!");

        // 5. Optional: Update Local State
        // If you want to immediately display the added items in your UI, you could do:
        // setWardrobeItems(prevItems => [...prevItems, ...extractedItems]);
      } else {
        throw new Error(`Error upserting to Pinecone: ${response.statusText}`);
      }
    } catch (err) {
      // 6. Error Handling
      if (err instanceof Error) {
        setError(err.message); // Display specific error message to the user
      } else {
        setError("An unexpected error occurred.");
      }
      console.error(err); // Log the error for debugging
    } finally {
      setIsLoading(false);
    }
  };

  // const handleUpsert = async () => {
  //   setIsLoading(true);
  //   setError(null); // Clear previous errors
  //   setUpsertMessage(null); // Clear the previous upsert message

  //   let items =

  //   try {
  //     const response = await fetch("/api/pinecone", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ method: "upsert", data: items }), // Send the array of items
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Error upserting to Pinecone: ${response.statusText}`);
  //     }

  //     const data = await response.json();
  //     setUpsertMessage(data.message);
  //   } catch (err) {
  //     setError("An error occurred while adding the items.");
  //     console.error(err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    setIsLoading(true);
    setError(null);

    try {
      if (
        query === "" &&
        !filters.category &&
        !filters.color &&
        !filters.style
      ) {
        // No query and no active filters, fetch all items
        setFilteredItems(existingWardrobe);
      } else {
        // Construct filter object for Pinecone query
        const pineconeFilters: Record<string, string> = {};
        if (filters.category) pineconeFilters.category = filters.category;
        if (filters.color) pineconeFilters.color = filters.color;
        if (filters.style) pineconeFilters.style = filters.style;

        // Send the query and filter object to your API endpoint
        const response = await fetch("/api/pinecone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            method: "query",
            data: {
              query: query ? query : "Describe the user's existing wardrobe",
              filter: pineconeFilters,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json(); // Try to get detailed error info
          throw new Error(errorData.error || "Error querying Pinecone");
        }

        // Parse the response from Pinecone
        const data = (await response.json()) as PineconeResult;

        // Update the filtered items state with results from Pinecone
        setFilteredItems(
          data.matches.map(
            (match) => match.metadata as ClothingItem | AccessoryItem
          )
        );
      }
    } catch (error: any) {
      // Handle errors, update error state and log to console
      setError(error.message || "An error occurred while querying.");
      console.error(error);
    } finally {
      // Set loading to false after the API call, regardless of success or failure
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
        <CustomButton
          onClick={handleUpsert}
          color="customBlack"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Sample Blouse"}
        </CustomButton>

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
        ) : filteredItems.length > 0 ? (
          <Grid container spacing={2} mt={2}>
            {filteredItems.map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  className="transform hover:scale-105 transition-transform duration-300 shadow-md"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    padding: 2,
                    boxShadow: 3,
                    borderRadius: 2,
                    margin: 1,
                    "&:hover": {
                      boxShadow: 5,
                    },
                  }}
                >
                  {/* CardMedia (Optional) */}
                  {/* {item.imageUrl && ( // Conditionally render if imageUrl exists
                    <CardMedia
                      component="img"
                      alt={item.itemId}
                      height="250" // Or any desired fixed height
                      image={item.imageUrl}
                      sx={{ objectFit: "cover" }} // Maintain aspect ratio and cover the container
                    />
                  )} */}

                  <CardContent sx={{ flexGrow: 1 }}>
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
                        sx={{ textTransform: "capitalize" }}
                      >
                        {item.subcategory}
                      </Typography>
                      {item.brand && (
                        <Badge
                          badgeContent={item.brand}
                          color="warning"
                          sx={{ textTransform: "capitalize" }}
                        />
                      )}
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                      {item.additionalNotes}
                    </Typography>

                    <Box mt={1}>
                      {(item.style || []).map((style) => (
                        <Chip
                          key={style}
                          label={style}
                          size="small"
                          className="mr-1"
                        />
                      ))}
                      {(item.color || []).map((color) => (
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
              </Grid>
            ))}
          </Grid>
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
