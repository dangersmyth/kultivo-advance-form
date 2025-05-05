
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PinInput from "@/components/PinInput";
import { encryptData } from "@/utils/encryption";

interface PrefillData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vendorId: string;
  redirectUrl: string;
}

interface LoanApplicationFormProps {
  prefillData?: PrefillData;
}

// Cash limit for the example
const CASH_LIMIT = 300;

// Form validation schema
const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone_number: z.string().min(10, "Please enter a valid phone number"),
  user_PIN: z.string().length(6, "PIN must be exactly 6 digits").regex(/^\d+$/, "PIN must contain only numbers"),
});

type FormValues = z.infer<typeof formSchema>;

const LoanApplicationForm = ({ prefillData = { firstName: "", lastName: "", email: "", phone: "", vendorId: "default_vendor_id", redirectUrl: "https://kultivo.com/success" } }: LoanApplicationFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with React Hook Form and Zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: prefillData.firstName,
      last_name: prefillData.lastName,
      email: prefillData.email,
      phone_number: prefillData.phone,
      user_PIN: "",
    },
  });

  // Apply pre-filled data whenever it changes
  useEffect(() => {
    if (prefillData) {
      form.setValue("first_name", prefillData.firstName);
      form.setValue("last_name", prefillData.lastName);
      form.setValue("email", prefillData.email);
      form.setValue("phone_number", prefillData.phone);
    }
  }, [prefillData, form]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Encrypt the PIN before processing
      const encryptedPin = await encryptData(data.user_PIN);
      
      // Create submission data with encrypted PIN and timestamp
      const submissionData = {
        ...data,
        user_PIN: encryptedPin,
        user_id: crypto.randomUUID(), // Generate random user ID
        timestamp: new Date().toISOString(),
      };
      
      console.log("Form submitted with data:", {
        ...submissionData,
        user_PIN: "******", // Hide PIN in logs
      });
      
      // Store data in session storage for next steps
      sessionStorage.setItem("kultivo_user_data", JSON.stringify({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number,
        // Don't store the PIN in session storage
      }));
      
      // Simulate API submission delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Build bank connection URL
      const bankUrl = `https://banks-staging.talefin.com/v1/i/kultivo/${prefillData.vendorId}/banks?firstName=${encodeURIComponent(data.first_name)}&lastName=${encodeURIComponent(data.last_name)}&email=${encodeURIComponent(data.email)}&phoneNumber=${encodeURIComponent(data.phone_number)}&collect=account_owner&collect=analysis&success_url=${encodeURIComponent(prefillData.redirectUrl)}`;
      
      // Navigate to bank connection page with URL
      navigate("/connect-bank", { state: { bankUrl } });
      
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-3">Thank you for choosing Kultivo!</h1>
        <p className="text-gray-600">
          You have been approved for a ${CASH_LIMIT} wage advance, subject to you proving your income. Complete this form to open your account and access your cash advance. Payment is due on your next day you receive pay.
        </p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-800">Complete your details</h2>
        <p className="text-gray-600 text-sm">Your name and contact details to set up your account</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name (as shown on ID)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surname (as shown on ID)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your surname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="user_PIN"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Create a PIN</FormLabel>
                <FormControl>
                  <PinInput 
                    value={field.value}
                    onChange={field.onChange}
                    length={6}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="pt-4">
            <h2 className="text-xl font-medium text-gray-800 mb-2">Connect your bank</h2>
            <p className="text-gray-600 text-sm mb-6">
              You're ready to complete sign up. We're going to ask to connect your bank accounts to verify your income. We use bank-level encryption and security to protect your data. We don't share data with third-parties.
            </p>
            
            <Button 
              type="submit" 
              className="w-full py-6 text-base"
              disabled={isSubmitting}
            >
              Sign up and connect my bank
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              By signing up, you accept our{" "}
              <a href="/terms" className="text-blue-600 hover:underline">Terms of Use</a> and{" "}
              <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoanApplicationForm;
