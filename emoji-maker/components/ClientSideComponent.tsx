'use client';

import { useEffect } from 'react';

export default function ClientSideComponent() {
  useEffect(() => {
    const createUserProfile = async () => {
      try {
        const response = await fetch('/api/user', { method: 'POST' });
        if (!response.ok) {
          throw new Error('Failed to create user profile');
        }
        // Optionally, you can do something with the response
        // const data = await response.json();
        // console.log('User profile created/verified:', data);
      } catch (error) {
        console.error('Error creating user profile:', error);
        // Handle error (e.g., show a notification to the user)
      }
    };

    createUserProfile();
  }, []);

  return null; // or any UI you need
}
