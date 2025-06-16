
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileText, BarChart3, LogOut, Brain, Settings, HelpCircle, Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/ThemeProvider"
import EditUserProfile from "./EditUserProfile"
import SettingsDialog from "./SettingsDialog"
import HelpDialog from "./HelpDialog"

interface AppSidebarProps {
  userData: { id: number; name: string; email: string };
  onRegisterTestSuite: () => void;
  onDisplayTestSuites: () => void;
  onLogout: () => void;
  onDashboard: () => void;
  onUpdateUser?: (userData: { id: number; name: string; email: string }) => void;
}

const AppSidebar = ({ 
  userData, 
  onRegisterTestSuite, 
  onDisplayTestSuites, 
  onLogout, 
  onDashboard,
  onUpdateUser = () => {}
}: AppSidebarProps) => {
  const { setTheme, theme } = useTheme();

  const handleLogout = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/user/${userData.id}/`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!res.ok) {
        throw new Error("Failed to delete user");
      }
  
      onLogout(); // clear state, navigate, etc.
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      onClick: onDashboard,
    },
    {
      title: "Create Test Suite",
      icon: FileText,
      onClick: onRegisterTestSuite,
    },
    {
      title: "View Test Suites",
      icon: FileText,
      onClick: onDisplayTestSuites,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">
            AI Evaluator
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button onClick={item.onClick} className="w-full">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </button>
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
              <button className="flex items-center gap-3 mb-3 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                    {userData.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {userData.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {userData.email}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Monitor className="mr-2 h-4 w-4" />
                  <span>Appearance</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              
              <SettingsDialog>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </SettingsDialog>
              
              <HelpDialog>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help</span>
                </DropdownMenuItem>
              </HelpDialog>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex gap-2">
            <EditUserProfile userData={userData} onUpdateUser={onUpdateUser} />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
