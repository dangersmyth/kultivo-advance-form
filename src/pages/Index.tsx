
import { useState } from "react";
import LoanApplicationForm from "@/components/LoanApplicationForm";
import { useSearchParams } from "react-router-dom";

const Index = () => {
  // Extract query params for pre-filling data
  const [searchParams] = useSearchParams();
  
  // Pre-fill data from URL parameters if available
  const prefillData = {
    firstName: searchParams.get("firstName") || "",
    lastName: searchParams.get("lastName") || "",
    email: searchParams.get("email") || "",
    phone: searchParams.get("phone") || "",
    vendorId: searchParams.get("vendor_id") || "default_vendor_id",
    redirectUrl: searchParams.get("redirect_url") || "https://kultivo.com/success"
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <div className="w-full max-w-2xl px-4 py-8">
        <LoanApplicationForm prefillData={prefillData} />
      </div>
    </div>
  );
};

export default Index;
