import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Heading, Image, Text } from '@chakra-ui/react';
import NavBar from './components/NavBar';
import { db } from '../firebase'; // Import the Firestore database configuration
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/router';

interface Blog {
  id: string;
  title: string;
  imageUrl: string;
  likesCount: number;
}

const MainPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'blogs'));
        const blogData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Blog, 'id'>), // Ensure correct typing for document data
        })) as Blog[]; // Cast the data to the Blog type
        setBlogs(blogData);
      } catch (error) {
        console.error('Error fetching blogs:', (error as Error).message);
      }
    };
    fetchData();
  }, []);

  const handleBoxClick = (blogId: string) => {
    router.push(`/blog/${blogId}`);
  };

  return (
    <Box>
      <NavBar />
      <Container maxW="container.lg" mt="150px">
        <Heading as="h1" mb={8} color={'white'}>
          Latest Blog Posts
        </Heading>
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
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
              onClick={() => handleBoxClick(blog.id)}
              cursor="pointer"
            >
              <Image src={blog.imageUrl} alt={blog.title} mb={2} />
              <Text fontWeight="bold" color="white" mt={2}>
                {blog.title}
              </Text>
              <Text color="gray.300" mt={1}>
                Likes: {blog.likesCount}
              </Text>
            </Box>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default MainPage;
