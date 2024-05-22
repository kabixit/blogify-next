import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, AuthError, UserCredential } from 'firebase/auth';
import { app } from '../firebase';
import { Box, Text, Input, Stack, Button, Image, Link, Heading } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const Signup = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null); 
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const auth = getAuth(app);
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User signed up:', user);
      router.push('/MainPage'); // Navigate to the home page after successful login
    } catch (error: any) { // Catch the specific error type from Firebase Auth
      setError(error.message);
      console.error('Signup error:', error.message);
    }
  };

  const navigateToLogin = () => {
    router.push('/Login'); // Navigate to the login page
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
        paddingTop="50px"
        
      >
        <Heading color="white" paddingBottom="20px">BLOGIFY</Heading>
        <form onSubmit={handleSignUp}>
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
              Sign Up
            </Button>
          </Stack>
        </form>
        {error && <Text color="red.500" mt={2}>{error}</Text>}
        <Link onClick={navigateToLogin} color="white" fontWeight="bold" mt={10}>Already have an account? LOGIN</Link>
      </Box>
    </div>
  );
};

export default Signup;
