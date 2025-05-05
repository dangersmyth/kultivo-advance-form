
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ConnectBank = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bankUrl, setBankUrl] = useState<string>("");
  
  useEffect(() => {
    // Get bank URL from location state or redirect back to form
    if (location.state?.bankUrl) {
      setBankUrl(location.state.bankUrl);
    } else {
      navigate("/");
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="px-6 py-4 border-b border-gray-200 flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="text-gray-600"
        >
          Back
        </Button>
        <h1 className="flex-1 text-center text-lg font-medium">Connect Your Bank</h1>
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="text-blue-600"
        >
          Cancel
        </Button>
      </header>
      
      <main className="flex-1">
        {bankUrl ? (
          <iframe 
            src={bankUrl}
            title="Bank Connection"
            className="w-full h-full border-0"
            allow="camera *; microphone *"
            aria-label="Bank connection iframe"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Loading bank connection...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ConnectBank;
