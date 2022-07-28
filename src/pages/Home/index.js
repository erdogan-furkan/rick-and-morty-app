import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  SimpleGrid,
  Box,
  Button,
  Heading,
  Spinner,
  Alert,
  ScaleFade,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Stack,
  FormLabel,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import {
  getCharacters,
  getFilteredCharacters,
  setFilters,
  setIsFiltered,
  setStatus,
} from "../../redux/characters/charactersSlice";

function Home() {
  const dispatch = useDispatch();
  const characters = useSelector((state) => state.characters.items);
  const page = useSelector((state) => state.characters.page);
  const hasNextPage = useSelector((state) => state.characters.hasNextPage);
  const isFiltered = useSelector((state) => state.characters.isFiltered);
  const filters = useSelector((state) => state.characters.filters);
  const prevFilters = useSelector((state) => state.characters.prevFilters);
  const status = useSelector((state) => state.characters.status);
  const error = useSelector((state) => state.characters.error);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const firstField = useRef();
  const bottomRef = useRef();

  const { values, initialValues, handleChange, handleSubmit } = useFormik({
    initialValues: {
      name: "",
      status: "",
      species: "",
      gender: "",
    },
    onSubmit: (values) => {
      const newValues = { ...values, name: values.name.trim() };

      if (JSON.stringify(newValues) === JSON.stringify(initialValues)) {
        return toast({
          title: "Please enter some filters or cancel.",
          status: "error",
          duration: 2000,
        });
      }

      if (
        JSON.stringify(newValues) === JSON.stringify(filters) ||
        JSON.stringify(newValues) === JSON.stringify(prevFilters)
      ) {
        return toast({
          title: "Please try again with different filters or cancel.",
          status: "error",
          duration: 2000,
        });
      }

      dispatch(getFilteredCharacters({ ...newValues, reset: true }));
      dispatch(setFilters(newValues));
      onClose();
    },
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(getCharacters());
    }

    if (status === "notfound") {
      toast({ title: "No exact matches found.", duration: 2000 });
      dispatch(setFilters(prevFilters));
      dispatch(setStatus("succeeded"));
    }
  }, [dispatch, status, toast, prevFilters]);

  if (status === "failed") {
    return (
      <Alert status="error" justifyContent="center">
        Error: {error}
      </Alert>
    );
  }

  const basicBoxStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    boxSize: { base: "300px", md: "230px", lg: "250px" },
    color: "white",
    textShadow: "0 0 20px black",
    fontWeight: "bold",
    fontSize: "20px",
    px: 4,
  };

  return (
    <div>
      {status === "loading" ? <Spinner /> : null}

      {status !== "loading" && (
        <>
          <SimpleGrid columns={{ sm: 1, md: 3 }} spacing={5}>
            &nbsp;
            <Heading
              as="h2"
              p="1rem"
              bgGradient="linear(to-l, #7928CA, #FF0080)"
              bgClip="text"
            >
              Characters
            </Heading>
            <Box
              display="flex"
              justifyContent={{ base: "center", md: "flex-end" }}
              alignItems="center"
              mb={{ base: "1rem", md: 0 }}
            >
              <Button variant="ghost" pt="1" onClick={onOpen}>
                Filter
              </Button>

              <Button
                variant="ghost"
                colorScheme="red"
                pt="1"
                disabled={!isFiltered}
                onClick={async () => {
                  if (isFiltered) {
                    await dispatch(
                      getFilteredCharacters({ ...initialValues, reset: true })
                    );

                    dispatch(setFilters(initialValues));

                    dispatch(setIsFiltered(false));
                  }
                }}
              >
                Reset
              </Button>
            </Box>
          </SimpleGrid>

          <SimpleGrid columns={{ sm: 1, md: 3, xl: 5 }} spacing={5}>
            {characters.map((character) => (
              <Link to={`/character/${character.id}`} key={character.id}>
                <ScaleFade initialScale={0.9} in={true}>
                  <Box
                    sx={basicBoxStyles}
                    background={`url(${character.image}) center/cover no-repeat`}
                    boxShadow="xl"
                    borderWidth="1px"
                    className="character"
                  >
                    {character.name}
                  </Box>
                </ScaleFade>
              </Link>
            ))}
          </SimpleGrid>

          <Button
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            bgClip="text"
            variant="link"
            my="1rem"
            onClick={async () => {
              if (isFiltered) {
                await dispatch(
                  getFilteredCharacters(
                    filters ? { ...filters, page } : { ...initialValues, page }
                  )
                );
              } else {
                await dispatch(getCharacters(page));
              }
              bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            disabled={hasNextPage ? false : true}
          >
            {hasNextPage ? "Load more" : "Nothing more to load"}
          </Button>
        </>
      )}

      <div ref={bottomRef} />

      <Drawer
        isOpen={isOpen}
        placement="right"
        initialFocusRef={firstField}
        onClose={onClose}
        size={{ base: "full", md: "xs" }}
      >
        <form onSubmit={handleSubmit}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Filter</DrawerHeader>

            <DrawerBody>
              <Stack spacing="24px">
                <Box>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Input
                    ref={firstField}
                    id="name"
                    name="name"
                    placeholder="Character name"
                    onChange={handleChange}
                    value={values.name}
                  />
                </Box>

                <Box>
                  <FormLabel htmlFor="status">Select status</FormLabel>
                  <Select
                    id="status"
                    name="status"
                    onChange={handleChange}
                    value={values.status}
                    variant="filled"
                  >
                    <option value="">All</option>
                    <option value="alive">Alive</option>
                    <option value="dead">Dead</option>
                    <option value="unknown">Unknown</option>
                  </Select>
                </Box>

                <Box>
                  <FormLabel htmlFor="species">Select species</FormLabel>
                  <Select
                    id="species"
                    name="species"
                    onChange={handleChange}
                    value={values.species}
                    variant="filled"
                  >
                    <option value="">All</option>
                    <option value="human">Human</option>
                    <option value="alien">Alien</option>
                    <option value="robot">Robot</option>
                    <option value="unknown">Unknown</option>
                  </Select>
                </Box>

                <Box>
                  <FormLabel htmlFor="gender">Select gender</FormLabel>
                  <Select
                    id="gender"
                    name="gender"
                    onChange={handleChange}
                    value={values.gender}
                    variant="filled"
                  >
                    <option value="">All</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="genderless">Genderless</option>
                    <option value="unknown">Unknown</option>
                  </Select>
                </Box>
              </Stack>
            </DrawerBody>

            <DrawerFooter borderTopWidth="1px">
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="purple" type="submit">
                Submit
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </div>
  );
}

export default Home;
