// BlogPostPage.tsx
import { Box, Heading, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Blog = () => {
  const router = useRouter();
  const { title, content, imageUrl } = router.query; // Retrieve data from query params

  // State to store blog post data
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    imageUrl: '',
  });

  useEffect(() => {
    // Set blog post data when component mounts
    if (title && content && imageUrl) {
      setPostData({
        title: title as string,
        content: content as string,
        imageUrl: imageUrl as string,
      });
    }
  }, [title, content, imageUrl]);

  return (
    <Box p={4}>
      <Heading>{postData.title}</Heading>
      <Box mt={4}>
        <img src={postData.imageUrl} alt="Blog Post Image" style={{ maxWidth: '100%' }} />
      </Box>
      <Text mt={4}>{postData.content}</Text>
    </Box>
  );
};

export default Blog;
