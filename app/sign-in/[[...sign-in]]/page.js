'use client'
import React from 'react';
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material';
import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';



export default function SignUpPage() {
    const router = useRouter(); // Initialize the useRouter hook

    const goToHomePage = () => {
        router.push('/'); // Navigate to the homepage
    };

    return (
        <Container maxWidth="100vw" sx={{ p: 0, minHeight: '100vh', backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <AppBar position="static" sx={{ borderRadius: '20px', backgroundColor: 'white', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <Image src="/brand.png" alt="Convoflash Logo" onClick={goToHomePage} width={160} height={40} />

                    </Typography>
                    <Button variant="contained" sx={{ backgroundColor: 'gold', color: 'black', borderRadius: '20px', mr: 2, '&:hover': { backgroundColor: 'darkgoldenrod' } }} href="/sign-in">Login</Button>

                    <Button variant="contained" sx={{ backgroundColor: 'gold', color: 'black', borderRadius: '20px', '&:hover': { backgroundColor: 'darkgoldenrod' } }} href="/sign-up">Sign Up</Button>

                </Toolbar>
            </AppBar>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={{ textAlign: 'center', my: 4 }}
            >
                <Typography color='white' fontFamily="Courier New, sans-serif" variant="h4" component="h1" gutterBottom>
                    Sign In
                </Typography>
                <SignUp />
            </Box>
        </Container>
    );
}
