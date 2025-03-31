import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import WebcamVerification from "@/components/auth/WebcamVerification";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Auth() {
  const [isRegister, setIsRegister] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleVerificationComplete = (success: boolean) => {
    console.log("Verification complete:", success);
    setShowWebcam(false);
    setIsVerified(success);
    
    if (success) {
      toast({
        title: "Verification Successful",
        description: "You can now complete your registration.",
      });
    } else {
      toast({
        title: "Verification Failed",
        description: "This platform is only for women. Please try again if there was an error.",
        variant: "destructive",
      });
      // Reset form on verification failure
      form.reset();
    }
  };

  const startVerification = () => {
    if (!form.getValues().email || !form.getValues().password) {
      toast({
        title: "Missing Information",
        description: "Please fill in your email and password first.",
        variant: "destructive",
      });
      return;
    }
    setShowWebcam(true);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isRegister) {
        if (!isVerified) {
          toast({
            title: "Verification Required",
            description: "Please complete gender verification first.",
            variant: "destructive",
          });
          return;
        }

        // Double check verification status
        if (!isVerified) {
          console.error("Attempted to register without verification");
          toast({
            title: "Error",
            description: "Gender verification is required for registration.",
            variant: "destructive",
          });
          return;
        }
      }

      setIsLoading(true);
      const response = await fetch(`/api/${isRegister ? 'register' : 'login'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          isVerified: isRegister ? isVerified : undefined
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text() || 'Authentication failed');
      }

      const data = await response.json();
      
      if (isRegister) {
        toast({
          title: "Registration Successful",
          description: "You can now log in with your credentials.",
        });
        setIsRegister(false);
      } else {
        // Handle successful login
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      if (isRegister) {
        setIsVerified(false); // Reset verification on error
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">
            {isRegister ? "Create an account" : "Welcome back"}
          </h1>
          <p className="text-muted-foreground">
            {isRegister
              ? "Enter your details to create your account"
              : "Enter your credentials to sign in"}
          </p>
        </div>

        {showWebcam ? (
          <WebcamVerification
            onVerificationComplete={handleVerificationComplete}
            onCancel={() => setShowWebcam(false)}
          />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                {isRegister && !isVerified && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={startVerification}
                  >
                    Verify Gender
                  </Button>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || (isRegister && !isVerified)}
                >
                  {isLoading ? (
                    <>Loading...</>
                  ) : isRegister ? (
                    "Create account"
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </div>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setIsVerified(false);
                    form.reset();
                  }}
                >
                  {isRegister
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Create one"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}