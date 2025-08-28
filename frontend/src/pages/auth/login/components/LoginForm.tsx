import React, { useState } from "react";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Button } from "../../../../components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLogin } from "@/lib/api/hooks/useLogin";
interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
  
    const loginMutation = useLogin();
    const navigate = useNavigate();
  
   
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData((prev) => ({ ...prev, [id]: value }));
    };
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        console.log(formData)
      e.preventDefault();
      setError("");
      loginMutation.mutate(
        formData,
        {
          onSuccess: () => {
            
            toast.success("Login successful!")
            navigate("/dashboard");
          },
          onError: (err: any) => {
            // Handle errors
            alert(err.response?.data?.message || "Login failed");
          },
        }
      );
    };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="user@tenant.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button
            type="button"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            // onClick={toggleShowPassword}
          >
            {/* {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} */}
          </Button>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <Button type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...</> : "Sign In"}
        </Button>
        <div className='flex text-sm justify-center space-x-2' >
        <span  >
          Don't have an account 
        </span>
        <span className='text-primary' onClick={() => navigate('/register')} >
        Sign up
        </span>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
};

export default LoginForm;
