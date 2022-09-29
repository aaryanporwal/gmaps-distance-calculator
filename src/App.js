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

const center = { lat: 48.8584, lng: 2.2945 };

function App() {
  // https://github.com/JustFly1984/react-google-maps-api/issues/238
  const [libraries] = useState(["places"]);
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
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
    // eslint-disable-next-line no-undef
    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
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
        bgColor="white"
        shadow="outline"
        zIndex="1"
      >
        <HStack spacing={1}>
          <Box p={1}>
            <Autocomplete>
              <HStack spacing={2} mt={2}>
                <Text>Origin</Text>
                <Input
                  type="text"
                  placeholder="Example: Delhi"
                  ref={originRef}
                />
              </HStack>
            </Autocomplete>
          </Box>
          <Box p={1}>
            <Autocomplete>
              <HStack spacing={2} mt={2}>
                <Text>Destination</Text>
                <Input
                  type="text"
                  placeholder="Example: Mumbai"
                  ref={destinationRef}
                />
              </HStack>
            </Autocomplete>
          </Box>
          <ButtonGroup variant="outline">
            <Button colorScheme="green" type="submit" onClick={calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              aria-label="center back"
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent="space-between">
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <IconButton
            aria-label="center back"
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.setZoom(10);
              map.panTo(center);
            }}
          />
        </HStack>
      </Box>
    </Flex>
  );
}

export default App;
