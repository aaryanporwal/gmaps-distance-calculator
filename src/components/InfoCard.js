import React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

import { Autocomplete } from "@react-google-maps/api";
import { FaLocationArrow, FaTimes } from "react-icons/fa";

const InfoCard = ({
  originRef,
  destinationRef,
  calculateRoute,
  clearRoute,
  distance,
  duration,
  reCenterCB,
}) => (
  <Box
    position="absolute"
    left={0}
    p={4}
    borderRadius="xl"
    m={4}
    bgColor="#00142191"
    opacity={0.98}
    backdropFilter={"auto"}
    backdropBlur={"15px"}
    textColor="white"
    border={"1px solid grey"}
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
            _placeholder={{
              color: "whitesmoke",
            }}
            data-cy="originInput"
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
            _placeholder={{
              color: "whitesmoke",
            }}
            data-cy="destinationInput"
            ref={destinationRef}
          />
        </Autocomplete>
      </Box>
      <ButtonGroup variant="solid" p={1} spacing={3}>
        <Button
          colorScheme="green"
          type="submit"
          data-cy="calculateBtn"
          onClick={calculateRoute}
        >
          Calculate Route
        </Button>
        <Button
          aria-label="center back"
          icon={<FaTimes />}
          onClick={clearRoute}
          border="1px solid #E2E8F0"
          textColor="black"
        >
          Reset
        </Button>
        <IconButton
          aria-label="center back"
          icon={<FaLocationArrow />}
          border="1px solid #E2E8F0"
          textColor="black"
          isRound
          onClick={reCenterCB}
        />
      </ButtonGroup>
      <VStack spacing={4} mt={4} pl={2} align>
        <Text data-cy="distanceText">
          <b>Distance:</b> {distance}{" "}
        </Text>
        <Text data-cy="durationText">
          <b>Duration:</b> {duration}{" "}
        </Text>
      </VStack>
    </VStack>
  </Box>
);

export default InfoCard;
