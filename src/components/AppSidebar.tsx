
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FileText, LayoutGrid, Brain, User, Moon, Sun, LogOut, Settings, HelpCircle, ChevronUp } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface AppSidebarProps {
  userData: { id: number; name: string; email: string };
  onRegisterTestSuite: () => void;
  onDisplayTestSuites: () => void;
  onLogout: () => void;
  onDashboard: () => void;
}

const AppSidebar = ({ userData, onRegisterTestSuite, onDisplayTestSuites, onLogout, onDashboard }: AppSidebarProps) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  }; 
  const handleLogout = async () => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/user/${userData.id}/`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete user");
    }

    onLogout(); // Clear user state or redirect
  } catch (error) {
    console.error("Logout error:", error);
  }
};


  

  const menuItems = [
    {
      title: "Register Test Suite",
      icon: FileText,
      onClick: onRegisterTestSuite,
    },
    {
      title: "Display Test Suites",
      icon: LayoutGrid,
      onClick: onDisplayTestSuites,
    },
  ]; 

  

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-4">
          <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">AI Evaluator</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Enterprise Platform</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start h-12 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={item.onClick}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.title}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                    {userData.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {userData.email || 'user@example.com'}
                  </p>
                </div>
                <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" side="top" align="end">
              <DropdownMenuLabel className="text-gray-800 dark:text-gray-100">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem onClick={onDashboard} className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200">
                <LayoutGrid className="w-4 h-4 mr-2" />
                <span className="truncate">Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200">
                <Settings className="w-4 h-4 mr-2" />
                <span className="truncate">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleTheme} className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200">
                {theme === "light" ? (
                  <Moon className="w-4 h-4 mr-2" />
                ) : (
                  <Sun className="w-4 h-4 mr-2" />
                )}
                <span className="truncate">Appearance</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200">
                <HelpCircle className="w-4 h-4 mr-2" />
                <span className="truncate">Help</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors duration-200">
                <LogOut className="w-4 h-4 mr-2" />
                <span className="truncate">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
