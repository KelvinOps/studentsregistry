"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth"; 

export default function Navigation() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleLogoClick = () => {
    if (user?.role === "ADMIN" || user?.role === "STAFF") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={handleLogoClick}
              className="flex items-center hover:opacity-80 transition-opacity"
              data-testid="button-logo"
            >
              <GraduationCap className="text-2xl text-primary mr-3" size={32} />
              <span className="text-xl font-bold text-foreground">EduManage</span>
            </button>
            <span className="ml-4 text-sm text-muted-foreground">
              {user?.role === "ADMIN" || user?.role === "STAFF"
                ? "Admin Portal"
                : "Student Portal"}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated && user && (
              <>
                <div className="text-sm text-muted-foreground">
                  Welcome,{" "}
                  <span
                    className="font-medium text-foreground"
                    data-testid="text-user-name"
                  >
                    {user.firstName || user.email?.split("@")[0] || "User"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  data-testid="button-logout"
                >
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
