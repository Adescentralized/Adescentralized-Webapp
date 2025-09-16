import { LayoutDashboard, PlusCircle, Wallet, User, Zap, Sun, Moon, LogOut } from "lucide-react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { useTheme } from "@/components/theme-provider"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Create Campaign", url: "/create", icon: PlusCircle },
  { title: "Credits", url: "/credits", icon: Wallet },
  { title: "Profile", url: "/profile", icon: User },
]

export function AppSidebar() {
  const { setTheme, theme } = useTheme()
  const { state } = useSidebar()
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-gradient-primary text-white font-medium shadow-glow" 
      : "hover:bg-secondary/50 text-foreground"

  const collapsed = state === "collapsed"

  const handleLogout = () => {
    logout()
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    })
    navigate("/login")
  }

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-gradient-card border-r border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                  Adescentralized
                </h2>
                <p className="text-xs text-foreground">Campaign Platform</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="px-4">
          <SidebarGroupLabel className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border space-y-2">
        {!collapsed && user && (
          <div className="text-xs text-muted-foreground mb-2">
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="truncate">{user.email}</p>
          </div>
        )}
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="h-4 w-4 hidden dark:block" />
            {!collapsed && <span className="ml-2">Theme</span>}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}