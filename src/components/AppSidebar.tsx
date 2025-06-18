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
import { FileText, BarChart3, LogOut, Brain, Settings, HelpCircle } from "lucide-react"
import { useTheme } from "@/components/ThemeProvider"
import { ThemeToggle } from "@/components/ThemeToggle"
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
    <Sidebar className="border-r bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6" />
          <span className="text-lg font-semibold">OrionAI</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                {userData.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{userData.name}</span>
              <span className="text-xs text-sidebar-foreground/70">{userData.email}</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={item.onClick}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Open settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
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
  )
}

export default AppSidebar
