'use client';

import { useState, useEffect } from 'react';
import { useUser, SignedIn, SignedOut, UserButton  } from '@clerk/nextjs'; 
import { doc, collection, getDocs } from 'firebase/firestore';
import db from '../../firebase';
import { Grid,Box, Container, Card, CardActionArea, CardContent, Typography, AppBar, Toolbar, Button } from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';


export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  
  const searchParams = useSearchParams();
  const search = searchParams.get('id');
  const router = useRouter();

  const goToHomePage = () => {
    router.push('/'); // Navigate to the homepage
  };
  
  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;
      
      const colRef = collection(db, 'users', user.id, search);
      const querySnapshot = await getDocs(colRef);
      
      const fetchedFlashcards = [];
      querySnapshot.forEach((doc) => {
        fetchedFlashcards.push({ id: doc.id, ...doc.data() });
      });
      
      setFlashcards(fetchedFlashcards);
    }
    getFlashcard();
  }, [user, search]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!isLoaded) {
    return <Typography>Loading user data...</Typography>;
  }

  if (!isSignedIn) {
    return <Typography>Please sign in to view your flashcards.</Typography>;
  }

  return (
    <Container maxWidth="100vw" sx={{ p: 0, minHeight: '100vh', backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <AppBar position="static" sx={{ borderRadius: '20px', backgroundColor: 'white', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <Image src="/brand.png" alt="Convoflash Logo" onClick={goToHomePage} width={160} height={40} />

                    </Typography>
                    
                    <SignedIn>
                      <Button variant="contained" sx={{ backgroundColor: 'gold', color: 'black', borderRadius: '20px', mr: 2, '&:hover': { backgroundColor: 'darkgoldenrod' } }} href="/flashcards">Collection</Button>
                      <UserButton />
                    </SignedIn>
                </Toolbar>
            </AppBar>
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard) => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                <CardContent>
                  <Box 
                    sx={{ 
                      perspective: '1000px' 
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        height: '200px',
                        transition: 'transform 0.6s',
                        transformStyle: 'preserve-3d',
                        transform: flipped[flashcard.id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                      }}
                    >
                      {/* Front side of the card */}
                      <Box
                        sx={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 2,
                          boxSizing: 'border-box',
                          backgroundColor: '#fff',
                        }}
                      >
                        <Typography variant="h5" component="div">
                          {flashcard.front}
                        </Typography>
                      </Box>

                      {/* Back side of the card */}
                      <Box
                        sx={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 2,
                          boxSizing: 'border-box',
                          backgroundColor: '#f8f8f8',
                          transform: 'rotateY(180deg)',
                        }}
                      >
                        <Typography variant="h5" component="div">
                          {flashcard.back}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
