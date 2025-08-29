
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
export const LogoutButton = () => {
  const {logout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <button onClick={handleLogout}>
      <LogOut className="mr-1 h-5 w-5" />
    </button>
  );
};
