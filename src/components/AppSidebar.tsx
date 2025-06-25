import { useState } from "react";
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
import { FileText, BarChart3, LogOut, Brain, Settings, HelpCircle, ChevronsLeft } from "lucide-react"
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
  const [collapsed, setCollapsed] = useState(false);

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
    <Sidebar className={`border-r border-blue-500 bg-sidebar text-sidebar-foreground ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
      <SidebarHeader className="border-b border-blue-500 border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6" />
            {!collapsed && <span className="text-lg font-semibold">OrionAI Evaluator</span>}
          </div>
          <div className="relative">
  <Button
    variant="ghost"
    size="icon"
    className="absolute left-[-2px] top-1/2 transform -translate-y-1/2 h-8 w-8 border border-blue-500 rounded-full bg-white shadow-md hover:scale-105 transition-transform z-10"
    onClick={() => setCollapsed(!collapsed)}
  >
    <ChevronsLeft
      className={`h-5 w-5 text-blue-600 transition-transform duration-300 ${!collapsed ? "" : "rotate-180"}`}
    />
  </Button>
</div>



        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                {userData.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">{userData.name}</span>
                <span className="text-xs text-sidebar-foreground/70">{userData.email}</span>
              </div>
            )}
          </div>
          {!collapsed && (
  <div
    className={`p-0.2 border-2 rounded-md transition-shadow ${
      theme === "dark" ? "border-blue-500" : "border-yellow-500"
    }`}
  >
    <ThemeToggle />
  </div>
)}


        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={item.onClick} className="justify-start">
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-blue-500 border-sidebar-border p-4">
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
            {!collapsed && <EditUserProfile userData={userData} onUpdateUser={onUpdateUser} />}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
