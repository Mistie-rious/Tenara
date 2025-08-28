import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import {  } from "../../../components/ui/card";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback } from "../../../components/ui/avatar";
import { Shield } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Mail } from "lucide-react";
import { Calendar } from "lucide-react";
import { Activity } from "lucide-react";
import type { User } from "../../../lib/types/project";

const parseDate = (dateStr?: string) => {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();
  const date = new Date(trimmed);
  return isNaN(date.getTime()) ? null : date;
};


const UserProfileCard = ({ user }: { user: User }) => (

  
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 flex items-start space-x-3">
        <Avatar className="w-12 h-12">
          <AvatarFallback>{(user.username || user.name || 'U').substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="space-y-1 flex-1 min-w-0">
          <CardTitle className="text-base">{user.username || user.name || 'Unknown User'}</CardTitle>
          <div className="flex items-center flex-wrap gap-2">
            <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="text-xs">
              {user.role === 'ADMIN' && <Shield className="mr-1 h-3 w-3" />}
              {user.role}
            </Badge>
           
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center text-muted-foreground">
          <Mail className="mr-2 h-3 w-3" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Calendar className="mr-2 h-3 w-3" />
          <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Activity className="mr-2 h-3 w-3" />
          <span>{user.lastLogin ? `Last login ${new Date(user.lastLogin).toLocaleDateString()}` : 'Never logged in'}</span>
        </div>
      </CardContent>
    </Card>
  );
  
  export default UserProfileCard