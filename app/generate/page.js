'use client';

import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  CardActionArea,
  AppBar,
  Toolbar,
} from '@mui/material';
import Image from 'next/image';

import db from '../../firebase';
import { SignedIn, SignedOut,UserButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { doc, collection, setDoc, getDoc, writeBatch } from 'firebase/firestore';

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const goToHomePage = () => {
    router.push('/'); // Navigate to the homepage
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      });
      const data = await response.json();
      setFlashcards(data); // Update state with fetched flashcards
    } catch (error) {
      console.error('Error generating flashcards:', error);
    }
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const saveFlashcards = async () => {
    if (!isLoaded || !isSignedIn) {
      console.error('User is not signed in or user data is not loaded');
      return;
    }

    if (!name) {
      alert('Please enter a name for your flashcard collection.');
      return;
    }

    try {
      const batch = writeBatch(db);
      const docRef = doc(collection(db, 'users'), user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcardSets || [];
        if (collections.find((f) => f.name === name)) {
          alert('Flashcard collection with the same name already exists.');
          return;
        } else {
          collections.push({ name });
          batch.set(docRef, { flashcardSets: collections }, { merge: true });
        }
      } else {
        batch.set(docRef, { flashcardSets: [{ name }] });
      }

      const colRef = collection(docRef, name);
      flashcards.forEach((flashcard) => {
        const cardDocRef = doc(colRef);
        batch.set(cardDocRef, flashcard);
      });

      await batch.commit();
      handleClose();
      router.push('/flashcards');
    } catch (error) {
      console.error('Error saving flashcards:', error);
    }
  };

  return (
    <Container maxWidth="100vw" sx={{ p: 0, minHeight: '100vh', backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <AppBar position="static" sx={{ borderRadius: '20px', backgroundColor: 'white', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <Image src="/brand.png" alt="Convoflash Logo" onClick={goToHomePage} width={160} height={40} />

                    </Typography>
                    <SignedOut>
                      <Button variant="contained" sx={{ backgroundColor: 'gold', color: 'black', borderRadius: '20px', mr: 2, '&:hover': { backgroundColor: 'darkgoldenrod' } }} href="https://github.com/TelmenBay/Convoflash">Learn More</Button>
                      <Button variant="contained" sx={{ backgroundColor: 'gold', color: 'black', borderRadius: '20px', mr: 2, '&:hover': { backgroundColor: 'darkgoldenrod' } }} href="/sign-in">Login</Button>
                      <Button variant="contained" sx={{ backgroundColor: 'gold', color: 'black', borderRadius: '20px', '&:hover': { backgroundColor: 'darkgoldenrod' } }} href="/sign-up">Sign Up</Button>
                    </SignedOut>
                    <SignedIn>
                      <Button variant="contained" sx={{ backgroundColor: 'gold', color: 'black', borderRadius: '20px', mr: 2, '&:hover': { backgroundColor: 'darkgoldenrod' } }} href="/flashcards">Collection</Button>
                      <UserButton />
                    </SignedIn>
                </Toolbar>
            </AppBar>   
      <Box maxWidth="100vw" sx={{ my: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography color='white' fontFamily="Courier New, sans-serif" variant="h4">Generate Flashcards</Typography>
        <Paper sx={{ p: 4, width: '100%'}}>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text (Ex: 'French to English')"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained" sx={{ backgroundColor: 'gold', color: 'black', borderRadius: '20px', '&:hover': { backgroundColor: 'darkgoldenrod' } }}
            onClick={handleSubmit}
            fullWidth
          >
            Generate Flashcards
          </Button>
        </Paper>
      </Box>

      {flashcards.length > 0 && (
        <>
          <Box sx={{ mt: 4 }}>
            <Typography color='white' fontFamily="Courier New, sans-serif" variant="h5" component="h2" gutterBottom align='center'>
              Generated Flashcards
            </Typography>
            <Grid container spacing={3}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardActionArea onClick={() => handleCardClick(index)}>
                      <CardContent>
                        <Box
                          sx={{
                            perspective: '1000px',
                            '& > div': {
                              transition: 'transform 0.6s',
                              transformStyle: 'preserve-3d',
                              position: 'relative',
                              width: '100%',
                              height: '200px',
                              boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                              transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                            },
                            '& > div > div': {
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              backfaceVisibility: 'hidden',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: 2,
                              boxSizing: 'border-box',
                            },
                            '& > div > div:nth-of-type(2)': {
                              transform: 'rotateY(180deg)',
                            },
                          }}
                        >
                          <div>
                            <div>
                              <Typography variant="h5" component="div">{flashcard.front}</Typography>
                            </div>
                            <div>
                              <Typography variant="h5" component="div">{flashcard.back}</Typography>
                            </div>
                          </div>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" sx={{ backgroundColor: 'gold', color: 'black', borderRadius: '20px', '&:hover': { backgroundColor: 'darkgoldenrod' } }} onClick={handleOpen}>
                Save Flashcards
              </Button>
            </Box>
          </Box>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Save Flashcard Set</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter a name for your flashcard collection
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Set Name"
                type="text"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant='outlined'
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={saveFlashcards} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
}
