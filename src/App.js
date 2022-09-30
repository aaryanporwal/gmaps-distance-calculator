import InfoCard from "./components/InfoCard";
import {
  useJsApiLoader,
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useRef, useState, useCallback } from "react";
import { Box, Flex, SkeletonText } from "@chakra-ui/react";

const center = { lat: 28.6297, lng: 77.3721 };

// https://github.com/JustFly1984/react-google-maps-api/issues/238
const libraries = ["places"];

const App = () => {
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("0.0 km");
  const [duration, setDuration] = useState("0 mins");
  const originRef = useRef();
  const destinationRef = useRef();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const reCenter = useCallback(() => {
    map.setZoom(10);
    map.panTo(center);
  }, [map]);

  if (!isLoaded) {
    return <SkeletonText />;
  }
  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  const calculateRoute = async () => {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    try {
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,

        travelMode: window.google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance.text);
      setDuration(results.routes[0].legs[0].duration.text);
    } catch (err) {
      console.log(err);
      setDistance("Can't find a route");
      setDuration("Can't find a route");
      setDirectionsResponse(null);
    }
  };

  const clearRoute = () => {
    setDirectionsResponse(null);
    setDistance("0.0 km");
    setDuration("0 mins");
    originRef.current.value = "";
    destinationRef.current.value = "";
  };

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
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          {/* <Marker position={center} /> */}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>
      {/* Modal Box */}
      <InfoCard
        originRef={originRef}
        destinationRef={destinationRef}
        calculateRoute={calculateRoute}
        clearRoute={clearRoute}
        distance={distance}
        duration={duration}
        reCenterCB={reCenter}
      />
    </Flex>
  );
};

export default App;
