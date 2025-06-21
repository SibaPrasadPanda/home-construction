import { Moon, Sun, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

interface TopBarProps {
  title: string;
  description: string;
}

export function TopBar({ title, description }: TopBarProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
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
          
          {/* Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-construction rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">JB</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">John Builder</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Project Owner</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
