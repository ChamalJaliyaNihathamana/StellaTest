import { Box, Container, Typography } from "@mui/material";

interface VideoOnboardProps {}

const VideoOnboard: React.FunctionComponent<VideoOnboardProps> = () => {
  return (
    <Container maxWidth="md">

      <Box className="container mx-auto p-4" p={4}>
        <Typography variant="h5" component="h1" gutterBottom>
          Video Onboard
        </Typography>
      </Box>
    </Container>
  );
};

export default VideoOnboard;
