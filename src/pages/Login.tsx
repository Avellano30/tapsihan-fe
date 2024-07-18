import { Box, Button, Center, Image, PasswordInput, TextInput } from "@mantine/core";
import { IconEyeCheck, IconEyeOff, IconChevronRight } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { endpoint } from "../main";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${endpoint}/auth/login`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        console.error("Failed to login");
        return;
      }

      const data = await response.json();

      localStorage.setItem("session", data.authentication.sessionToken)
      navigate('/products');


    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const session = localStorage.getItem("session");
    if (session) {
      navigate('/products');
    }
  }, [navigate]);


  const icon = <IconChevronRight size={30} />;
  return (
    <>



<div style={{ backgroundColor: "#e3ad63", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>


<Box style={{ display: "flex", flexDirection: "row", gap: "20px", backgroundColor: "#940e0e",padding: "10px", borderRadius: "20px" }}>


      <Box style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Image src="/butch_logo.jpg" alt="Login Illustration" w={300} h={400} />
        </Box>


        <Box style={{ display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center", padding:"20px"}}> 

          <h1 style = {{color:"white", fontSize:"40px", fontWeight:"bold", letterSpacing: '0.03em'}}> Welcome!</h1>
        <TextInput w="350px" onChange={(e) => setEmail(e.target.value)} value={email}
        radius="xl"
          styles={{
            input: {
              border: '2px solid',
              borderColor: '#f3a463',
            }
          }}
          c={"#f3a463"}
          label="Email"
          description=" "
        />
        <PasswordInput w="350px" onChange={(e) => setPassword(e.target.value)} value={password}
        radius="xl"
          styles={{
            input: {
              border: '2px solid',
              borderColor: '#f3a463',
            }
          }}
          c={"#f3a463"}
          label="Password"
          description=" "
          visibilityToggleIcon={({ reveal }) =>
            reveal ? (
              <IconEyeOff style={{ width: 'var(--psi-icon-size)', height: 'var(--psi-icon-size)', color:'black' }} />
            ) : (
              <IconEyeCheck style={{ width: 'var(--psi-icon-size)', height: 'var(--psi-icon-size)', color: 'black' }} />
            )
          }
        />
        <Center>
        <Button w="150px" mt="20px" justify="center" fullWidth rightSection={icon} onClick={handleLogin} 
          variant="filled"
          color="#e3ad63"
          radius="xl"
          c={'black'}
          styles={{
            root: {
              letterSpacing: '0.05em'
            },
          }}
          >Login
          
          
        </Button>
        </Center>
      </Box>

      
      </Box>
      </div>
    </>
  )
}