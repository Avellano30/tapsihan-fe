import { BackgroundImage, Box, Button, Center, Image, PasswordInput, TextInput } from "@mantine/core";
import { IconEyeCheck, IconEyeOff} from "@tabler/icons-react";
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

  return (
    <>



<div style={{ height: "100vh", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
  
<Box>
<hr style={{ 
  width: "300px",
  borderStyle: "solid", 
  borderColor: "white", 
  borderWidth: "1px 0 0 0", 
  marginBottom: "20px"
}} />

<h1 style = {{color:"white", fontSize:"25px", letterSpacing: '0.2em',  textAlign: "center", marginBottom:"30px"}}> Welcome Back</h1>

</Box>

  <BackgroundImage
    src="/bgc.jpg"
    style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, zIndex: -1 }}
  />


<Box style={{ display: "flex", flexDirection: "row", gap: "20px", backgroundColor: "white",padding: "10px" }}>

  


        <Box style={{ display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center", padding:"20px"}}>
          
        <Box style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Image src="/bw_tapsihan.png" alt="Login Illustration" w={300} h={150} />
        </Box>

          <h1 style = {{color:"black", fontSize:"30px", fontWeight:"bold", letterSpacing: '0.08em',  textAlign: "center", marginTop:"-30px"}}> Admin Login</h1>
        <TextInput w="350px" onChange={(e) => setEmail(e.target.value)} value={email}
          styles={{
            input: {
              border: '2px solid',
              borderColor: 'black',
            }
          }}
          c={"black"}
          label="Email:"
          description=" "
        />
        <PasswordInput w="350px" onChange={(e) => setPassword(e.target.value)} value={password}
          styles={{
            input: {
              border: '2px solid',
              borderColor: 'black',
            }
          }}
          c={"black"}
          label="Password:"
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
        <Button w="350px" h="50px" mt="20px"  onClick={handleLogin} 
          variant="filled"
          color="black"
          c={'white'}
          styles={{
            root: {
              letterSpacing: '0.05em'
            },
          }}
          >Sign In
          
          
        </Button>
        </Center>
      </Box>

      
      </Box>
      </div>
    </>
  )
}