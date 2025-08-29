import React, { useState } from "react";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Button } from "../../../../components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error] = useState("");
  
    const { loginMutation } = useAuth();

    const navigate = useNavigate();
  
    const toggleShowPassword = () => setShowPassword((prev) => !prev);

  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData((prev) => ({ ...prev, [id]: value }));
    };
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      loginMutation.mutate(formData);
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
          <button
            type="button"
       
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={toggleShowPassword}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <Button   type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...</> : "Sign In"}
        </Button>
        <div className='flex text-sm justify-center space-x-2' >
        <span  >
          Don't have an account 
        </span>
        <button className='text-primary' onClick={() => navigate('/register')} >
        Sign up
        </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
};

export default LoginForm;
