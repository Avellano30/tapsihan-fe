import { Box, Button, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  return (
    <>
      <Box className="mt-1 mb-5 justify-center flex">
        <Text fw={"bold"} fz={25}>
          Thank you for visiting Gabbi's Tapsihan!

        </Text>
      </Box>

      <Box className="flex justify-center">
        <Button color="black"
          onClick={() => {
            localStorage.removeItem("session"),
              localStorage.removeItem("index"),
              navigate("/")
          }}
        >
          Sign out
        </Button>
      </Box>



    </>
  )
}
