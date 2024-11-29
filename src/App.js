import React, { useState, useRef, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Input,
  Button,
  Text,
  VStack,
  Spinner,
  Image,
  Tooltip,
} from "@chakra-ui/react";
import "./App.css";
import axios from "axios";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Text color="red.500">Something went wrong. Please try again later.</Text>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState("metric");

  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;

  const videoList = [
    "/videos/videoplayback4 .mp4", 
  ];

  const videoRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleVideoEnded = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === videoList.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const handleCanPlay = () => {
        videoElement.play().catch((error) => {
          console.error("Error playing video:", error);
        });
      };

      videoElement.addEventListener("canplay", handleCanPlay);

      videoElement.load();

      return () => {
        videoElement.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [currentVideoIndex]); // Dependency on `currentVideoIndex` to change video

  const fetchWeatherData = async () => {
    if (!city.trim()) {
      alert("Please enter a valid city name.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`
      );

      if (response.data.sys.country !== "ZA") {
        alert("Please enter a city in South Africa.");
        setWeatherData(null);
        return;
      }

      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
      alert("Unable to fetch weather data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnitToggle = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
    setWeatherData(null);
  };

  return (
    <ChakraProvider>
      <ErrorBoundary>
        {/* Background video */}
        <Box className="background-layer">
          <video
            ref={videoRef}
            className="background-video"
            autoPlay
            muted
            onEnded={handleVideoEnded}
          >
            <source src={videoList[currentVideoIndex]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>

        <VStack
          spacing={4}
          align="center"
          justify="center"
          p={5}
          borderRadius="md"
          w="100%"
          h="100vh"
          position="relative"
          zIndex="1"
        >
          <Text fontSize="3xl" fontWeight="bold" color="white">
            Weather Dashboard
          </Text>

          <Tooltip label="Type in your ZA Province (First Letter Must Be Capitalized)">
            <Input
              placeholder="Enter Province Name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              size="lg"
              bg="gray.700"
              color="white"
              w="50%"
            />
          </Tooltip>

          <Button onClick={fetchWeatherData} colorScheme="teal" size="lg">
            Fetch Weather
          </Button>

          {loading ? (
            <Spinner size="xl" />
          ) : weatherData ? (
            <Box>
              <Text fontSize="2xl" fontWeight="bold" color="white">
                {weatherData.name}, {weatherData.sys.country}
              </Text>
              <Text fontSize="3xl" fontWeight="bold" color="white">
                {weatherData.main.temp}° {unit === "metric" ? "C" : "F"}
              </Text>
              <Text fontSize="xl" color="white">
                {weatherData.weather[0].description}
              </Text>
              <Image
                boxSize="100px"
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                alt="Weather Icon"
              />
              <Text fontSize="lg" color="white">
                Humidity: {weatherData.main.humidity}%
              </Text>
              <Text fontSize="lg" color="white">
                Wind Speed: {weatherData.wind.speed} m/s
              </Text>
            </Box>
          ) : (
            <Text fontSize="lg" color="gray.400">
              No data to display.
            </Text>
          )}

          <Button onClick={handleUnitToggle} colorScheme="orange" size="sm">
            Toggle Unit (°C/°F)
          </Button>
        </VStack>
      </ErrorBoundary>
    </ChakraProvider>
  );
}

export default App;
