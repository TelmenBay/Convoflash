'use client'


import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs'; // Make sure to adjust this path as needed
import { doc, collection, setDoc, getDoc, writeBatch } from 'firebase/firestore';
import db from '../../firebase';

import { useSearchParams } from 'next/navigation';

export default function Flashcard(){

}