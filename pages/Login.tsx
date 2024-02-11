import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase';
import { Box, Text, Input, Stack, Button, Image, Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const auth = getAuth(app);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User logged in:', user);
      router.push('/MainPage'); // Navigate to the home page after successful login
    } catch (error: any) {
      setError(error.message);
      console.error('Login error:', error.message);
    }
  };

  const navigateToSignUp = () => {
    router.push('/SignUp'); // Navigate to the signup page
  };

  return (
    <div>
      <Box
        className="glassbox"
        position="absolute"
        width= "600px"
        height= "360px" 
        top="50%"
        left="50%"
        transform="translate(-50%, 50%)"
        display="flex"
        flexDirection="column"
        alignItems="center"
        paddingTop="100px"
      >
        <form onSubmit={handleLogin}>
          <Stack>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              variant="filled"
              color="white"
              _focus={{
                borderColor: '#D6A058',
              }}
              width="400px"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              variant="filled"
              color="white"
              _focus={{
                borderColor: '#D6A058',
              }}
              width="400px"
            />
            <Button type="submit" colorScheme="custom" bg="#D6A058" size="lg" fontFamily="'Black Han Sans', sans-serif">
              Login
            </Button>
          </Stack>
        </form>
        {error && <Text color="red.500" mt={2}>{error}</Text>}
        <Link onClick={navigateToSignUp} color="white" fontWeight="bold" mt={10}>Don't have an account? SIGN UP</Link>
      </Box>
    </div>
  );
};

export default Login;
