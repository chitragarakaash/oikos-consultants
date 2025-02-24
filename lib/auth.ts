interface User {
  email: string;
  name: string;
  role: string;
}

export function signIn(email: string, password: string): Promise<User | null> {
  return new Promise((resolve) => {
    // In a real app, these would be environment variables
    const ADMIN_EMAIL = 'info@oikosconsultants.com';
    const ADMIN_PASSWORD = 'admin123'; // Change this to a secure password

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const user = {
        email: ADMIN_EMAIL,
        name: 'Admin',
        role: 'admin',
      };
      // Store the user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      resolve(user);
    } else {
      resolve(null);
    }
  });
}

export function signOut(): void {
  localStorage.removeItem('user');
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated(): boolean {
  return getUser() !== null;
} 