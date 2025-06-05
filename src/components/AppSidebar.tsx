
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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
import { FileText, LayoutGrid, Brain, User } from "lucide-react";

interface AppSidebarProps {
  userData: { name: string; email: string };
  onRegisterTestSuite: () => void;
  onDisplayTestSuites: () => void;
}

const AppSidebar = ({ userData, onRegisterTestSuite, onDisplayTestSuites }: AppSidebarProps) => {
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
          <Brain className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold">AI Evaluator</h2>
            <p className="text-sm text-gray-600">Enterprise Platform</p>
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
                      className="w-full justify-start h-12 px-4"
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
        <div className="p-4 border-t">
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userData.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {userData.email || 'user@example.com'}
                  </p>
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80" side="right" align="end">
              <div className="flex items-start space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    <User className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">{userData.name}</h4>
                  <p className="text-sm text-gray-600">{userData.email}</p>
                  <div className="flex items-center pt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-500">Online</span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
