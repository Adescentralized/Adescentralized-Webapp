import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { User, Mail, Globe, Twitter, Calendar, Shield, Bell, Eye } from "lucide-react"

export default function Profile() {
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
                    JD
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">John Doe</h3>
                  <p className="text-muted-foreground">john.doe@example.com</p>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-web3-primary">Pro Member</Badge>
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
                <span>Jan 2024</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Campaigns created</span>
                <span className="font-medium">12</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total spent</span>
                <span className="font-medium">$2,340</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Success rate</span>
                <span className="font-medium text-web3-success">87%</span>
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
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Tell us about yourself and your Web3 interests"
                  rows={3}
                  defaultValue="Web3 marketing specialist focused on DeFi and NFT projects."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" placeholder="https://yourwebsite.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter Handle</Label>
                <Input id="twitter" placeholder="@yourusername" />
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
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Credit Balance Alerts</div>
                  <div className="text-sm text-muted-foreground">
                    Receive alerts when your credit balance is low
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Weekly Reports</div>
                  <div className="text-sm text-muted-foreground">
                    Get weekly performance summaries via email
                  </div>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Platform Updates</div>
                  <div className="text-sm text-muted-foreground">
                    Stay informed about new features and updates
                  </div>
                </div>
                <Switch defaultChecked />
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