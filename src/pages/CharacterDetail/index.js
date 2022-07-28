import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Spinner,
  Alert,
  Heading,
  Image,
  Box,
  Flex,
  Badge,
  Divider,
  CloseButton,
  ScaleFade,
} from "@chakra-ui/react";

function CharacterDetail() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_BASE_ENDPOINT}/character/${id}`
        );
        setCharacter(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Alert status="error" justifyContent="center">
        Error: {error.message}
      </Alert>
    );
  }
  return (
    <Box>
      <Box position="absolute" left="20px" top="20px">
        <Link to="/">
          <CloseButton />
        </Link>
      </Box>

      <ScaleFade initialScale={0.9} in={true}>
        <Heading
          as="h2"
          bgGradient="linear(to-l, blue.200, green.300)"
          bgClip="text"
        >
          {character.name}
        </Heading>

        <Flex
          borderWidth="1px"
          p="5"
          m="1rem"
          borderRadius="10"
          boxShadow="dark-lg"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            alt={character.name}
            borderRadius="full"
            src={character.image}
          />

          <Box p="6" w="full">
            <Box
              display="flex"
              alignItems="baseline"
              justifyContent="space-between"
              w="full"
            >
              <Badge
                borderRadius="full"
                px="2"
                pt="1"
                colorScheme={
                  character.status === "Alive"
                    ? "green"
                    : character.status === "Dead"
                    ? "red"
                    : null
                }
              >
                {character.status}
              </Badge>

              <Box
                color="gray.500"
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                textTransform="uppercase"
              >
                {character.species} - {character.gender}
              </Box>
            </Box>

            <Divider my="3" />

            <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
              Last location: {character.location.name}
            </Box>
          </Box>
        </Flex>
      </ScaleFade>
    </Box>
  );
}

export default CharacterDetail;
