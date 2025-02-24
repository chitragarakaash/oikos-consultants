"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, User, ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { signIn } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

export default function SignIn() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    showPassword: false
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimer, setBlockTimer] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (blockTimer > 0) {
      timer = setInterval(() => {
        setBlockTimer(prev => prev - 1);
      }, 1000);
    } else if (blockTimer === 0) {
      setIsBlocked(false);
    }
    return () => clearInterval(timer);
  }, [blockTimer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const togglePasswordVisibility = () => {
    setFormData(prev => ({
      ...prev,
      showPassword: !prev.showPassword
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      toast({
        title: "Access Blocked",
        description: `Please wait ${blockTimer} seconds before trying again.`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const user = await signIn(formData.username, formData.password);
      if (user) {
        // Reset attempts on successful login
        setAttempts(0);
        
        toast({
          title: "Success",
          description: "Welcome back! Redirecting to dashboard...",
        });
        
        router.push("/admin");
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          setIsBlocked(true);
          setBlockTimer(60); // Block for 60 seconds
          toast({
            title: "Too Many Attempts",
            description: "Please wait 60 seconds before trying again.",
            variant: "destructive"
          });
        } else {
          setError("Invalid username or password");
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F8FFF9] via-white to-[#F1F8F2]">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #2E7D32 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          opacity: 0.1
        }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 z-10 w-full flex justify-center"
      >
        <Link href="/" className="block relative group transition-transform duration-300 hover:scale-105">
          <div className="relative w-[200px] h-[60px] group-hover:drop-shadow-[0_0_8px_rgba(46,125,50,0.3)] transition-all duration-300">
            <Image
              src="/main-logo.png"
              alt="Oikos Consultants Logo"
              fill
              sizes="200px"
              priority
              style={{ objectFit: 'contain' }}
            />
          </div>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="z-10"
      >
        <Card className="w-[400px] shadow-xl border-neutral-200/50 backdrop-blur-sm bg-white/90">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] bg-clip-text text-transparent">
                Admin Sign In
              </CardTitle>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Settings className="w-5 h-5 text-[#2E7D32]" />
              </motion.div>
            </div>
            <CardDescription className="text-neutral-600">
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="space-y-2">
                <Label htmlFor="username" className="text-neutral-800">Username</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-[#2E7D32] transition-colors" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/80 border-neutral-200 focus:border-[#2E7D32] focus:ring-[#2E7D32] transition-all"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-neutral-800">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-[#2E7D32] transition-colors" />
                  <Input
                    id="password"
                    name="password"
                    type={formData.showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-white/80 border-neutral-200 focus:border-[#2E7D32] focus:ring-[#2E7D32] transition-all"
                    required
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-[#2E7D32]"
                    onClick={togglePasswordVisibility}
                  >
                    {formData.showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {isBlocked && (
                <div className="text-sm text-red-500 text-center">
                  Please wait {blockTimer} seconds before trying again
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100"
                disabled={isLoading || isBlocked}
              >
                {isLoading ? (
                  <motion.div 
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </motion.div>
                ) : (
                  "Sign In"
                )}
              </Button>

              <Link 
                href="/"
                className="inline-flex items-center justify-center text-sm text-neutral-600 hover:text-[#2E7D32] transition-colors group"
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