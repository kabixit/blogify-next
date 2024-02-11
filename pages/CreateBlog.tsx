import React, { useState, useEffect } from 'react';
import { Box, Heading, Input, Textarea, Button, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'; // Import User type
import { getStorage, ref, uploadBytes, getDownloadURL, UploadResult } from 'firebase/storage'; // Import UploadResult type
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; // Import the Firestore database configuration
import NavBar from './components/NavBar';

const CreateBlog = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // Specify File type
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Specify string type
  const router = useRouter();
  const toast = useToast();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const auth = getAuth();
    onAuthStateChanged(auth, (user: User | null) => { // Specify User type
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });
  }, [getAuth, onAuthStateChanged]); // Add dependencies

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Access files safely
    if (file) {
      setSelectedImage(file);

      // Create a preview URL for the selected image
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);
    }
  };

  const handleCreateBlog = async () => {
    if (!title || !content || !selectedImage || !userEmail) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields and select an image.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const storage = getStorage();
    const storageRef = ref(storage, `blog-images/${selectedImage.name}`);

    try {
      await uploadBytes(storageRef, selectedImage); // Specify UploadResult type for return value
      const downloadURL = await getDownloadURL(storageRef);

      // Add blog post to Firestore with owner email
      await addDoc(collection(db, 'blogs'), {
        title,
        content,
        imageUrl: downloadURL,
        timestamp: serverTimestamp(),
        ownerId: userEmail, // Add owner email
        likesCount: 0,
      });

      toast({
        title: 'Success',
        description: 'Blog post created successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Redirect to home page
      router.push('/MainPage');
    } catch (error) {
      console.error('Error uploading image:', (error as Error).message);
      toast({
        title: 'Error',
        description: 'An error occurred while uploading the image.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    
  };

  return (
    <>
      <NavBar />
      <Box p={4} margin='200px' marginLeft='400px'className="realglass">
        <Heading color="white" mb={4}>Create Blog</Heading>
        <Input placeholder="Title" value={title} color={'white'} onChange={(e) => setTitle(e.target.value)} mb={4} />
        <Textarea placeholder="Content" value={content} color={'white'} onChange={(e) => setContent(e.target.value)} mb={4} />
        {/* Display the preview image if available */}
        {previewImage && <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', marginBottom: '10px' }} />}
        <Input type="file" onChange={handleImageChange} mb={4} />
        <Button onClick={handleCreateBlog} colorScheme="custom" bg="#D6A058" fontFamily="'Black Han Sans', sans-serif">
          Create Blog
        </Button>
      </Box>
    </>
  );
};

export default CreateBlog;
