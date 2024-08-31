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
} from '@mui/material';
import db from '../../firebase';
import { useUser } from '@clerk/nextjs'; // Make sure to adjust this path as needed
import { useRouter } from 'next/navigation';
import { doc, collection, setDoc, getDoc, writeBatch } from 'firebase/firestore';


export default function Generate() {
  const {isLoaded, isSignedIn, user} = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    fetch('/api/generate', {
        method: 'POST',
        body: text,
      })
        .then((res) => res.json())
        .then((data) => setFlashcards(data))
  }

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
        ...prev,
        [id]: !prev[id],
    }))
  }

  const handleOpen = () => {
    setOpen(true);
  } 
  const handleClose = () => {
    setOpen(false);
  }
  const saveFlashcards = async () => {
    if (!isLoaded || !isSignedIn) {
      console.error('User is not signed in or user data is not loaded');
      return; // Prevent function from continuing if user is not signed in
    }
  
    if (!name) {
      alert('Please enter a name for your flashcard set.');
      return;
    }
  
    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, 'users'), user.id); // This line requires user.id to be defined
    const docSnap = await getDoc(userDocRef);
  
    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert('Flashcard collection with the same name already exists.');
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcardSets: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcardSets: [{ name }] });
    }
  
    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });
  
    await batch.commit();
    handleClose();
    router.push('/flashcards');
  };
  

    return (
        <Container maxWidth="md">
        <Box sx={{ my: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4">Generate Flashcards</Typography>
        <Paper sx={{ p: 4, width: '100%' }}>
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
            variant="contained"
            color="primary"
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
                <Typography variant="h5" component="h2" gutterBottom>
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
                                    height: '200px', // Adjust the height as necessary
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
                    <Button variant="contained" color="secondary" onClick={handleOpen}>
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
