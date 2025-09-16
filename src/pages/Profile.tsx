import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { User, Mail, Globe, Twitter, Calendar, Shield, Bell, Eye, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { apiService } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface UserProfile {
  user: {
    id: string;
    email: string;
    name: string;
    publicKey: string;
    userType?: string;
    created_at?: string;
    bio?: string;
    website?: string;
    twitter?: string;
  };
  campaigns: Array<{
    id: string;
    title: string;
    active: boolean;
    budget_xlm: number;
    spent_xlm: number;
    total_impressions: number;
    total_clicks: number;
    created_at: string;
  }>;
  stats: {
    totalCampaigns: number;
    totalSpent: number;
    successRate: number;
    memberSince: string;
  };
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notificationSettings, setNotificationSettings] = useState({
    campaignUpdates: true,
    creditAlerts: true,
    weeklyReports: false,
    platformUpdates: true,
  })
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    campaignAnalytics: false,
  })
  
  const { user, token } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !token) return

      try {
        setIsLoading(true)
        const profileData = await apiService.getUserProfile(user.id, token)
        setProfile(profileData)
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast({
          title: "Erro ao carregar perfil",
          description: error instanceof Error ? error.message : "Erro desconhecido",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user, token, toast])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-web3-primary" />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Não foi possível carregar os dados do perfil.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Profile Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gradient-card border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-2xl bg-gradient-primary text-white">
                    {getInitials('John Doe')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{profile.user.name}</h3>
                  <p className="text-muted-foreground">{profile.user.email}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-web3-primary">
                    {profile.user.userType === 'advertiser' ? 'Advertiser' : 'Publisher'}
                  </Badge>
                  <Badge variant="secondary">Verified</Badge>
                </div>
                <Button variant="outline" size="sm">
                  Change Avatar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Account Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member since</span>
                <span>
                  {'N/A'
                  }
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Campaigns created</span>
                <span className="font-medium">{1}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total spent</span>
                <span className="font-medium">{0} XLM</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Success rate</span>
                <span className="font-medium text-web3-success">{97}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-web3-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    defaultValue={'John'} 
                    disabled 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    defaultValue={'Doe'} 
                    disabled 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  defaultValue={profile.user.email} 
                  disabled 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Tell us about yourself and your Web3 interests"
                  rows={3}
                  defaultValue={profile.user.bio || ''}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  placeholder="https://yourwebsite.com"
                  defaultValue={profile.user.website || ''}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter Handle</Label>
                <Input 
                  id="twitter" 
                  placeholder="@yourusername"
                  defaultValue={profile.user.twitter || ''}
                  disabled
                />
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Profile editing is not available yet. Contact support to update your information.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-web3-secondary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Campaign Updates</div>
                  <div className="text-sm text-muted-foreground">
                    Get notified about campaign performance and status changes
                  </div>
                </div>
                <Switch 
                  checked={notificationSettings.campaignUpdates}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, campaignUpdates: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Credit Balance Alerts</div>
                  <div className="text-sm text-muted-foreground">
                    Receive alerts when your credit balance is low
                  </div>
                </div>
                <Switch 
                  checked={notificationSettings.creditAlerts}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, creditAlerts: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Weekly Reports</div>
                  <div className="text-sm text-muted-foreground">
                    Get weekly performance summaries via email
                  </div>
                </div>
                <Switch 
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Platform Updates</div>
                  <div className="text-sm text-muted-foreground">
                    Stay informed about new features and updates
                  </div>
                </div>
                <Switch 
                  checked={notificationSettings.platformUpdates}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, platformUpdates: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-web3-accent" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Manage your privacy settings and account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Profile Visibility</div>
                  <div className="text-sm text-muted-foreground">
                    Make your profile visible to other users
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Campaign Analytics</div>
                  <div className="text-sm text-muted-foreground">
                    Share anonymized campaign data for platform improvement
                  </div>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" placeholder="Enter current password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="Enter new password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                </div>
                <Button variant="outline" size="sm">
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Changes */}
          <div className="flex gap-4">
            <Button className="bg-gradient-primary hover:opacity-90 text-white shadow-glow">
              Save Changes
            </Button>
            <Button variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}