import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, DollarSign, Eye, Target, TrendingUp, Users } from "lucide-react"
import { Link } from "react-router-dom"

// Mock data for campaigns
const campaigns = [
  {
    id: 1,
    title: "Summer NFT Collection Launch",
    description: "Promoting our new summer-themed NFT collection across social platforms",
    budget: 2500,
    spent: 1200,
    status: "Active",
    views: 15420,
    clicks: 892,
    conversions: 34,
    startDate: "2024-03-01",
    endDate: "2024-03-31"
  },
  {
    id: 2,
    title: "DeFi Protocol Awareness",
    description: "Building awareness for our new DeFi yield farming protocol",
    budget: 5000,
    spent: 3200,
    status: "Active",
    views: 28750,
    clicks: 1456,
    conversions: 78,
    startDate: "2024-02-15",
    endDate: "2024-04-15"
  },
  {
    id: 3,
    title: "Web3 Gaming Beta",
    description: "User acquisition campaign for our play-to-earn game beta",
    budget: 1500,
    spent: 1500,
    status: "Completed",
    views: 9680,
    clicks: 534,
    conversions: 23,
    startDate: "2024-01-01",
    endDate: "2024-02-29"
  }
]

const stats = [
  {
    title: "Total Campaigns",
    value: "12",
    change: "+2 this month",
    icon: Target,
    color: "text-web3-primary"
  },
  {
    title: "Total Spent",
    value: "$15,240",
    change: "+12% from last month",
    icon: DollarSign,
    color: "text-web3-secondary"
  },
  {
    title: "Total Views",
    value: "127K",
    change: "+23% from last month",
    icon: Eye,
    color: "text-web3-accent"
  },
  {
    title: "Conversions",
    value: "234",
    change: "+8% from last month",
    icon: Users,
    color: "text-web3-success"
  }
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Campaign Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage your Web3 marketing campaigns
          </p>
        </div>
        <Link to="/create">
          <Button className="bg-gradient-primary hover:opacity-90 text-white shadow-glow">
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gradient-card border-border hover:shadow-card transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaigns */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recent Campaigns</h2>
          <Button variant="outline">View All</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="bg-gradient-card border-border hover:shadow-card transition-all cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{campaign.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {campaign.description}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={campaign.status === "Active" ? "default" : "secondary"}
                    className={campaign.status === "Active" ? "bg-web3-success" : ""}
                  >
                    {campaign.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Budget Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Budget</span>
                    <span>${campaign.spent} / ${campaign.budget}</span>
                  </div>
                  <Progress 
                    value={(campaign.spent / campaign.budget) * 100} 
                    className="h-2"
                  />
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm font-medium">{campaign.views.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Views</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{campaign.clicks.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Clicks</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{campaign.conversions}</div>
                    <div className="text-xs text-muted-foreground">Conversions</div>
                  </div>
                </div>

                {/* Date Range */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{campaign.startDate} - {campaign.endDate}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}