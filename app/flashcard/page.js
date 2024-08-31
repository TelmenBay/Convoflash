'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs'; 
import { doc, collection, getDocs } from 'firebase/firestore';
import db from '../../firebase';
import { Grid, Container, Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';
import { useSearchParams } from 'next/navigation';

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  
  const searchParams = useSearchParams();
  const search = searchParams.get('id');
  
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
    <Container maxWidth="md">
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
