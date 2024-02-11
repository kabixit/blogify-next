import { Box, Heading, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase'; // Import Firestore instance
import NavBar from '../components/NavBar';

const BlogPage = () => {
  const router = useRouter();
  const { id } = router.query; // Retrieve the blog post ID from query params

  // State to store blog post data
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    imageUrl: '',
  });

  useEffect(() => {
    // Fetch blog post data from Firestore
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'blogs', id); // Reference to the blog document
        const docSnap = await getDoc(docRef); // Get the document snapshot

        if (docSnap.exists()) {
          const data = docSnap.data(); // Extract blog post data from the document
          setPostData(data); // Update the state with blog post data
        } else {
          console.error('Blog post not found');
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
      }
    };

    if (id) {
      fetchData(); // Fetch data only if the blog post ID is available
    }
  }, [id]);

  return (
    <>
    <NavBar/>
    <Box p={4} className="realglass" margin={'200px'}>
      <Heading color='white'>{postData.title}</Heading>
      <Box mt={4}>
        <img src={postData.imageUrl} alt="Blog Post Image" style={{ maxWidth: '100%' }} />
      </Box>
      <Text mt={4} color='white'>{postData.content}</Text>
    </Box>
    </>
  );
};

export default BlogPage;
