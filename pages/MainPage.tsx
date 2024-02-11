import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Heading, Image, Text } from '@chakra-ui/react';
import NavBar from './components/NavBar';
import { db } from '../firebase'; // Import the Firestore database configuration
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/router';

const MainPage = () => {
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch blog data from Firestore
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'blogs'));
        const blogData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogData);
      } catch (error) {
        console.error('Error fetching blogs:', error.message);
      }
    };
    fetchData();
  }, []);

  // Function to handle box click
  const handleBoxClick = (blogId) => {
    router.push(`/blog/${blogId}`); // Assuming the route for Blog page is '/blog/[id]'
  };

  return (
    <Box>
      <NavBar />
      <Container maxW="container.lg" mt="150px">
        <Heading as="h1" mb={8} color={'white'}>
          Latest Blog Posts
        </Heading>
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
          {/* Map over the blogs array and render each blog post */}
          {blogs.map((blog) => (
            <Box
              key={blog.id}
              className="glassbox"
              width="100%"
              height="auto"
              p={4}
              borderRadius="md"
              boxShadow="lg"
              overflow="hidden"
              onClick={() => handleBoxClick(blog.id)} // Add onClick event handler
              cursor="pointer" // Add cursor pointer to indicate clickable
            >
              <Image src={blog.imageUrl} alt={blog.title} mb={2} />
              <Text fontWeight="bold" color="white" mt={2}>{blog.title}</Text>
            </Box>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default MainPage;
