import {
  Badge,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  VStack,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import { FiYoutube } from "react-icons/fi";
export default function StreamingInput() {
  const toast = useToast({
    duration: 3000,
    position: "top",
    title: "Streaming started successfully",
    status: "success",
  });
  const streamingFormik = useFormik({
    initialValues: {
      url: "",
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post("/api/streaming", {
          url: values.url,
        });
        toast();
      } catch (error) {
        toast({
          title: "Something went wrong, please try again",
          status: "error",
        });
      }
    },
  });
  return (
    <Box zIndex={99}>
      <Popover>
        <PopoverTrigger>
          <Button
            mr={3}
            colorScheme="red"
            variant={"ghost"}
            bg={"red.50"}
            pos={"relative"}
            // rounded={"full"}
            gap={3}
            size={"sm"}
            aria-label="active peers"
          >
            <FiYoutube />
            <Text>Stream to youtube</Text>
          </Button>
        </PopoverTrigger>

        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />

          <PopoverBody py={4} mt={4}>
            <VStack divider={<Divider />} gap={2}>
              <Stack bg={"gray.50"} p={2} w={"full"}>
                {/* This code works fine, the ts-ignore is because of the types of Stack(which is a div) and a div doesn't have an onSubmit, but in reality the code renders a form*/}
                {/* @ts-ignore */}
                <Stack as={"form"} onSubmit={streamingFormik.handleSubmit}>
                  <FormControl>
                    <FormLabel>Enter Streaming Url:</FormLabel>

                    <Input
                      type="url"
                      name="url"
                      value={streamingFormik.values.url}
                      onChange={streamingFormik.handleChange}
                      colorScheme="teal"
                      _focus={{
                        boxShadow: "0 0 0 1px teal",
                        borderColor: "teal",
                      }}
                      placeholder="Enter url"
                    />
                  </FormControl>
                  <Button
                    isLoading={streamingFormik.isSubmitting}
                    loadingText={"Streaming..."}
                    type="submit"
                    colorScheme="teal"
                  >
                    {" "}
                    Start streaming
                  </Button>
                </Stack>
              </Stack>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
}
