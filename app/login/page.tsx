"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, Github, Chrome } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/lib/auth";
import { useAuth } from "@/contexts/auth-context";
import { signIn } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import Cookies from "js-cookie";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { login: authLogin } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Inside the onSubmit function
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const { user, tokens } = await login(values.email, values.password);
      localStorage.setItem("tokens", JSON.stringify(tokens));
      Cookies.set("token", tokens.access_token);
      authLogin(user, tokens.access_token);
      router.push("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "github" | "google") => {
    try {
      const result = await signIn(provider, {
        callbackUrl: "/dashboard",
        redirect: true,
      });

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Authentication failed",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Authentication failed",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                {...form.register("email")}
                type="email"
                placeholder="Email"
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                {...form.register("password")}
                type="password"
                placeholder="Password"
                className="pl-10"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => handleSocialLogin("github")}
            className="w-full"
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSocialLogin("google")}
            className="w-full"
          >
            <Chrome className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>

        <div className="">
          <p>Demo account:</p>
          <p>Email: john@mail.com</p>
          <p>Password: changeme</p>
        </div>
      </div>
    </div>
  );
}
