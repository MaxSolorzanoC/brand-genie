'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useGlobalStore } from '@/store/useGlobalStore';

interface SyncUserProps {
  token?: string;
}

export function SyncUser({ token }: SyncUserProps) {

  const {setUser} = useGlobalStore();

  const router = useRouter();

  //Use the user token (from the cookies) to keep the user state variable up to date
  //This state variable is used for client components

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        const res = await fetch('/api/user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const {user} = await res.json();
          setUser(user); 
        } else {
          //In case the token is not valid, redirect to login page
          setUser(null); 
          router.push('/login')
        }
      }
    };

    fetchUser();
  }, [token, setUser]);

  return null;
}
