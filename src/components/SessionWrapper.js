'use client';

import { AuthProvider } from '@/context/AuthContext';

export default function NextAuthSessionProvider({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
