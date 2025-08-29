import React, { useState } from 'react';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Button } from '../../../../components/ui/button';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';

interface RegisterFormData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error] = useState('');
  const { registerMutation } = useAuth();
  

  const navigate = useNavigate();

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return;
    registerMutation.mutate({ name: formData.name, username: formData.username, email: formData.email, password: formData.password });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Organization Name</Label>
        <Input id="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" value={formData.username} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
          <button type="button"   className="absolute right-0 top-0 h-full px-3 py-2" onClick={toggleShowPassword}>
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          minLength={6}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <Button type="submit" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : 'Create Tenant'}
        </Button>
        <div className='flex text-sm justify-center space-x-2' >
        <span  >
          Already have an account? 
        </span>
        <button className='text-primary' onClick={() => navigate('/login')} >
        Log in
        </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
};

export default RegisterForm;
