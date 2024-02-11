import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Button, useToast, Input } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import {
  getDoc,
  doc,
  updateDoc,
  collection,
  where,
  query,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { db } from '../../firebase'; // Import Firestore instance
import { auth } from '../../firebase'; // Import Firebase auth instance
import NavBar from '../components/NavBar';
import { User } from 'firebase/auth';

interface BlogData {
  title: string;
  content: string;
  imageUrl: string;
  likesCount: number;
}

interface Comment {
  comment: string;
  userId: string;
}

const BlogPage = () => {
  const router = useRouter();
  const { id } = router.query; // Retrieve the blog post ID from query params
  const toast = useToast();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [postData, setPostData] = useState<BlogData>({
    title: '',
    content: '',
    imageUrl: '',
    likesCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'blogs', id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as BlogData;
          setPostData(data);
        } else {
          console.error('Blog post not found');
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const q = query(collection(db, 'comments'), where('postId', '==', id));
        const querySnapshot = await getDocs(q);
        const commentsData = querySnapshot.docs.map((doc) => doc.data() as Comment);
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (id) {
      fetchComments();
    }
  }, [id]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        checkUserLiked();
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const checkUserLiked = async () => {
    if (currentUser) {
      const q = query(collection(db, 'likes'), where('postId', '==', id), where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setHasLiked(true);
      }
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
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
      const docRef = doc(db, 'blogs', id as string);
      await updateDoc(docRef, { likesCount: postData.likesCount + 1 });
      setPostData((prevData) => ({ ...prevData, likesCount: prevData.likesCount + 1 }));

      await addDoc(collection(db, 'likes'), { postId: id, userId: currentUser!.uid });

      toast({
        title: 'Liked',
        description: 'You liked this blog post!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setHasLiked(true);
    } catch (error) {
      console.error('Error liking blog post:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!currentUser) {
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
      const user = auth.currentUser;
      const userEmail = user ? user.email : '';

      await addDoc(collection(db, 'comments'), {
        postId: id,
        userId: userEmail,
        comment: comment.trim(),
        timestamp: new Date(),
      });

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

        <Box mt={4}>
          <Heading size="md" color='white'>Comments</Heading>
          {comments.map((comment, index) => (
            <Box key={index} mt={4} p={4} borderRadius="md" boxShadow="md">
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
