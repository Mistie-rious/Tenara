import React, { useState } from "react";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Button } from "../../../../components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthStore } from "../../../../store/authStore";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../../../lib/api/services/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
  
    const loginUser = useAuthStore((state) => state.loginUser);
    const navigate = useNavigate();
  
    const mutation = useMutation({
      mutationFn: async (data: LoginFormData) => {
        const response = await login(data); 
        return response;
      },
      onSuccess: async (data) => {
        await loginUser(data);
        toast.success("Login successful!");
        navigate("/dashboard");
      },
      onError: (err: any) => {
        setError(err.response?.data?.message || "Something went wrong");
        toast.error("Please try again");
      },
    });
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData((prev) => ({ ...prev, [id]: value }));
    };
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
      mutation.mutate(formData);
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
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...</> : "Sign In"}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate("/register")}>
          Create New Tenant
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
};

export default LoginForm;
