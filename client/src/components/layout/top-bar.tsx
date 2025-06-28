import { Moon, Sun, Bell, ChevronDown, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TopBarProps {
  title: string;
  description: string;
}

export function TopBar({ title, description }: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Error",
          description: "Failed to log out",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Logged out successfully",
        });
        // The page will automatically redirect to landing due to auth state change
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.user_metadata) return "U";
    const firstName = user.user_metadata.firstName || user.user_metadata.first_name || "";
    const lastName = user.user_metadata.lastName || user.user_metadata.last_name || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user?.user_metadata) return "User";
    const firstName = user.user_metadata.firstName || user.user_metadata.first_name || "";
    const lastName = user.user_metadata.lastName || user.user_metadata.last_name || "";
    return `${firstName} ${lastName}`.trim() || user.email || "User";
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
          
          {/* Notifications */}
          <Button variant="outline" size="icon" className="relative">
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </Button>
          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-3 px-3 py-2 h-auto">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-construction text-white text-sm font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Project Owner</p>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}