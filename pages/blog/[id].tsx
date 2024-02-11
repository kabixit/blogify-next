import { Box, Heading, Text, Button, useToast, Input } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getDoc, doc, updateDoc, getFirestore, collection, where, query, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Import Firestore instance
import { auth } from '../../firebase'; // Import Firebase auth instance
import NavBar from '../components/NavBar';

const BlogPage = () => {
  const router = useRouter();
  const { id } = router.query; // Retrieve the blog post ID from query params
  const toast = useToast();

  const [currentUser, setCurrentUser] = useState(null); // State to store the current user
  const [hasLiked, setHasLiked] = useState(false); // State to track if the current user has liked the post
  const [comment, setComment] = useState(''); // State to store the user's comment
  const [comments, setComments] = useState([]); // State to store the comments for the blog post

  // State to store blog post data
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    likesCount: 0, // Add a state for likes count
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

  useEffect(() => {
    // Fetch comments for the current blog post
    const fetchComments = async () => {
      try {
        const q = query(collection(db, 'comments'), where('postId', '==', id));
        const querySnapshot = await getDocs(q);
        const commentsData = querySnapshot.docs.map((doc) => doc.data());
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (id) {
      fetchComments(); // Fetch comments only if the blog post ID is available
    }
  }, [id]);

  useEffect(() => {
    // Check if user is authenticated and update currentUser state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        checkUserLiked(); // Check if the current user has already liked the post
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to check if the current user has already liked the post
  const checkUserLiked = async () => {
    if (currentUser) {
      const q = query(collection(db, 'likes'), where('postId', '==', id), where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setHasLiked(true);
      }
    }
  };

  // Function to handle liking the blog post
  const handleLike = async () => {
    if (!currentUser) {
      // User is not authenticated
      toast({
        title: 'Authentication Required',
        description: 'You need to log in to like the blog post.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (hasLiked) {
      // User has already liked the post
      toast({
        title: 'Already Liked',
        description: 'You have already liked this blog post.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Update the likes count in Firestore
      const docRef = doc(db, 'blogs', id);
      await updateDoc(docRef, { likesCount: postData.likesCount + 1 });
      setPostData((prevData) => ({ ...prevData, likesCount: prevData.likesCount + 1 }));

      // Record that the current user has liked the post
      await addDoc(collection(db, 'likes'), { postId: id, userId: currentUser.uid });

      toast({
        title: 'Liked',
        description: 'You liked this blog post!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setHasLiked(true); // Update hasLiked state
    } catch (error) {
      console.error('Error liking blog post:', error);
    }
  };

  // Function to handle submitting a comment
  const handleSubmitComment = async () => {
    if (!currentUser) {
      // User is not authenticated
      toast({
        title: 'Authentication Required',
        description: 'You need to log in to submit a comment.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!comment.trim()) {
      // Comment is empty
      toast({
        title: 'Empty Comment',
        description: 'Please enter a comment before submitting.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Get the user's email from Firebase Authentication
      const user = auth.currentUser;
      const userEmail = user ? user.email : '';

      // Add the comment to Firestore
      await addDoc(collection(db, 'comments'), {
        postId: id,
        userId: userEmail, // Use the user's email as the userId
        comment: comment.trim(),
        timestamp: new Date(),
      });

      // Clear the comment input field
      setComment('');

      toast({
        title: 'Comment Added',
        description: 'Your comment has been submitted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while adding your comment.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <NavBar />
      <Box p={4} className="realglass" margin={'200px'}>
        <Heading color='white'>{postData.title}</Heading>
        <Box mt={4}>
          <img src={postData.imageUrl} alt="Blog Post Image" style={{ maxWidth: '100%' }} />
        </Box>
        <Text mt={4} color='white'>{postData.content}</Text>
        <Button mt={4} onClick={handleLike} disabled={!currentUser || hasLiked}>
          Like ({postData.likesCount})
        </Button>

        {/* Comment Form */}
        {currentUser && (
          <>
            <Input
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              mt={4}
              color='white'
            />
            <Button onClick={handleSubmitComment} mt={2} colorScheme="blue">
              Submit Comment
            </Button>
          </>
        )}

        {/* Display Comments */}
        <Box mt={4}>
  <Heading size="md" color='white'>Comments</Heading>
  {comments.map((comment, index) => (
    <Box key={index} mt={4} p={4} borderRadius="md"  boxShadow="md">
      <Text color="white">{comment.comment}</Text>
      <Text fontSize="sm" color="gray.400" mt={2}>
        {comment.userId}
      </Text>
    </Box>
  ))}
</Box>
      </Box>
    </>
  );
};

export default BlogPage;
