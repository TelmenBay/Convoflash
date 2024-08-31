'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Grid, Container, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import db from '../../firebase';

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();

    useEffect(() => {
        // Only fetch flashcards if the user is loaded and signed in
        if (!isLoaded || !isSignedIn || !user) return;

        async function getFlashcards() {
            try {
                const docRef = doc(collection(db, 'users'), user.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const collections = docSnap.data().flashcardSets || []; // Check if data is correctly fetched
                    console.log('Fetched collections:', collections);
                    setFlashcards(collections);
                } else {
                    console.log('No existing document found. Creating new document...');
                    await setDoc(docRef, { flashcardSets: [] });
                    setFlashcards([]);
                }
            } catch (error) {
                console.error('Error fetching flashcards:', error);
            }
        }
        getFlashcards();
    }, [isLoaded, isSignedIn, user]); // Updated dependency array to include isLoaded

    // Handling loading and user state
    if (!isLoaded) {
        return <Typography>Loading user data...</Typography>;
    }

    if (!isSignedIn) {
        return <Typography>Please sign in to view your flashcards.</Typography>;
    }

    // If no flashcards are found
    if (flashcards.length === 0) {
        return <Typography>No flashcards found. Please create some flashcards first.</Typography>;
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`);
    }

    return (
        <Container maxWidth='md'>
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                <CardContent>
                                    <Typography variant='h6'>
                                        {flashcard.name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
