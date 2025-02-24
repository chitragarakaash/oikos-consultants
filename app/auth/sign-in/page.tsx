"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import { signIn } from "@/lib/auth";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const user = await signIn(email, password);
      if (user) {
        router.push("/admin");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <Link href="/" className="block relative group">
          <div style={{ width: '280px', height: '80px', position: 'relative' }}>
            <Image
              src="/main-logo.png"
              alt="Oikos Consultants Logo"
              fill
              sizes="280px"
              priority
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="absolute -bottom-3 left-1/2 w-0 h-0.5 bg-[#2E7D32] transform -translate-x-1/2 transition-all duration-300 group-hover:w-full"></div>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="w-[400px] shadow-lg border-neutral-200/50">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Admin Sign In</CardTitle>
              <Lock className="w-5 h-5 text-[#2E7D32]" />
            </div>
            <CardDescription className="text-neutral-600">
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-800">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#2E7D32]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/80 border-[#E8F5E9] focus:border-[#2E7D32] transition-colors"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-neutral-800">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#2E7D32]" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white/80 border-[#E8F5E9] focus:border-[#2E7D32] transition-colors"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
              <Link 
                href="/"
                className="inline-flex items-center text-sm text-neutral-600 hover:text-[#2E7D32] transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transform transition-transform group-hover:-translate-x-1" />
                Back to website
              </Link>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
} 