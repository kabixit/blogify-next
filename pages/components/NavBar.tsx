// components/NavBar.tsx
import React from 'react';
import { Box, Flex, Spacer, Button, Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const NavBar = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Implement your logout logic here
    router.push('/Login');
  };

  return (
    <Box
      className="glassmorphism-container"
      position="fixed"
      top="65"
      width="100%"
      height="15%"
    >
      <Flex align="center">
        <Link fontSize="xl" fontWeight="bold" color="white" mt="14px" onClick={() => router.push('/MainPage')}>
          BLOGIFY
        </Link>
        <Spacer />
        <Box mt="14px">
          <Link color="white" fontWeight="bold" mr={20} onClick={() => router.push('/MainPage')}>
            Home
          </Link>
          <Link color="white" fontWeight="bold" mr={20} onClick={() => router.push('/CreateBlog')}>
            CreateBlog
          </Link>
        </Box>
        <Spacer />
        <Button onClick={handleLogout} colorScheme="custom" bg="#D6A058" mt="12px"fontFamily="'Black Han Sans', sans-serif">
          Logout
        </Button>
      </Flex>
    </Box>
  );
};

export default NavBar;
