import { Link, useLocation } from "wouter";
import { Home, DollarSign, StickyNote, CheckSquare, IndianRupeeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";

const navItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/finance", icon: IndianRupeeIcon, label: "Finance Tracker" },
  { href: "/notes", icon: StickyNote, label: "Notes" },
  { href: "/progress", icon: CheckSquare, label: "Progress Tracker" },
];

export function Sidebar() {
  const [location] = useLocation();
  
  const { data: project } = useQuery<Project>({
    queryKey: ["/api/project"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 fixed h-full overflow-y-auto">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-construction rounded-lg flex items-center justify-center">
            <Home className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Nivasa</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Home Builder</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Project Info */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="bg-gradient-to-r from-primary/5 to-construction/5 p-3 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
            {project?.name || "Loading..."}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {project?.location || ""}
          </p>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs text-gray-500">Budget Used</span>
            <span className="text-xs font-semibold text-construction-600">
              {stats?.budgetUsedPercent || 0}%
            </span>
          </div>
          <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-construction h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats?.budgetUsedPercent || 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
