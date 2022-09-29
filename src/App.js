import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useRef, useState } from "react";

const center = { lat: 28.6297, lng: 77.3721 };

function App() {
  // https://github.com/JustFly1984/react-google-maps-api/issues/238
  const [libraries] = useState(["places"]);
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const originRef = useRef();
  const destinationRef = useRef();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (!isLoaded) {
    return <SkeletonText />;
  }
  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  async function calculateRoute() {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,

      travelMode: window.google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="100vh"
      w="100vw"
    >
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        <GoogleMap
          center={center}
          zoom={10}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            mapId: "cfea29b2cc8a175f",
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>
      <Box
        position="absolute"
        left={0}
        p={4}
        borderRadius="xl"
        m={4}
        bgColor="#F5F5F5"
        shadow="outline"
        zIndex="1"
      >
        <Text as={"b"} fontSize="2xl">
          Distance Calculator
        </Text>
        <VStack align>
          {/* Origin Box */}
          <Box p={1}>
            <Text>Origin</Text>
            <Autocomplete>
              <Input
                type="text"
                placeholder="Example: Mumbai"
                ref={originRef}
              />
            </Autocomplete>
          </Box>
          {/* Destination Box */}
          <Box p={1}>
            <Text>Destination</Text>
            <Autocomplete>
              <Input
                type="text"
                placeholder="Example: Bangalore"
                ref={destinationRef}
              />
            </Autocomplete>
          </Box>
          <ButtonGroup variant="solid" p={1} spacing={3}>
            <Button colorScheme="green" type="submit" onClick={calculateRoute}>
              Calculate Route
            </Button>
            <Button
              aria-label="center back"
              icon={<FaTimes />}
              onClick={clearRoute}
              border="1px solid #E2E8F0"
            >
              Reset
            </Button>
            <IconButton
              aria-label="center back"
              icon={<FaLocationArrow />}
              isRound
              onClick={() => {
                map.setZoom(10);
                map.panTo(center);
              }}
            />
          </ButtonGroup>
          <VStack spacing={4} mt={4} pl={2} align>
            <Text>Distance: {distance} </Text>
            <Text>Duration: {duration} </Text>
          </VStack>
        </VStack>
      </Box>
    </Flex>
  );
}

export default App;
