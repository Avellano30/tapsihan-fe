import { Box, Button, Text } from "@mantine/core";
import { IconPower } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  return (
    <>
      <Box className="mt-1 mb-5 justify-center flex">
        <Text fw={"bold"} fz={25}>
          Settings

        </Text>
      </Box>

      <Box className="flex justify-center">
        <Button color="black"
          onClick={() => {
            localStorage.removeItem("session"),
              localStorage.removeItem("index"),
              navigate("/")
          }}
          leftSection={<IconPower />}
        >
          Logout
        </Button>
      </Box>



    </>
  )
}
