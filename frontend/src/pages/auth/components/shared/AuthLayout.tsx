import type { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
          </div>
          <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
          <CardDescription className="text-center">{subtitle}</CardDescription>
        </CardHeader>

        <CardContent>{children}</CardContent>

        {footer && <CardFooter className="text-center">{footer}</CardFooter>}
      </Card>
    </div>
  );
}
