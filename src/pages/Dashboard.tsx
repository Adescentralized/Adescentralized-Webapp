import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, DollarSign, Eye, Target, TrendingUp, Users, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { apiService } from "@/services/api"
import { useToast } from "@/hooks/use-toast"

interface Campaign {
  id: string;
  title: string;
  description: string;
  budget_xlm: number;
  spent_xlm?: number;
  active: boolean;
  total_impressions?: number;
  total_clicks?: number;
  total_revenue?: number;
  created_at: string;
}

interface DashboardData {
  user: {
    id: string;
    email: string;
    publicKey: string;
    userType?: string;
  };
  campaigns: Campaign[];
  sites: any[];
  summary: {
    totalCampaigns: number;
    totalSites: number;
    totalClicks: number;
    totalImpressions: number;
    totalSpent: number;
  };
}

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
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user, token } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id || !token) return

      try {
        setIsLoading(true)
        const data = await apiService.getDashboard(user.id, token)
        setDashboardData(data)
      } catch (error) {
        toast({
          title: "Erro ao carregar dashboard",
          description: error instanceof Error ? error.message : "Erro desconhecido",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [user?.id, token, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Erro ao carregar dados do dashboard</p>
      </div>
    )
  }

  const stats = [
    {
      title: "Total Campaigns",
      value: dashboardData.summary.totalCampaigns.toString(),
      change: "campanhas ativas",
      icon: Target,
      color: "text-web3-primary"
    },
    {
      title: "Total Spent",
      value: `${dashboardData.summary.totalSpent.toFixed(2)} XLM`,
      change: "em campanhas",
      icon: DollarSign,
      color: "text-web3-secondary"
    },
    {
      title: "Total Views",
      value: dashboardData.summary.totalImpressions.toLocaleString(),
      change: "impressões totais",
      icon: Eye,
      color: "text-web3-accent"
    },
    {
      title: "Total Clicks",
      value: dashboardData.summary.totalClicks.toString(),
      change: "cliques totais",
      icon: Users,
      color: "text-web3-success"
    }
  ]

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

        {dashboardData.campaigns.length === 0 ? (
          <Card className="bg-gradient-card border-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Você ainda não criou nenhuma campanha</p>
              <Link to="/create">
                <Button className="bg-gradient-primary hover:opacity-90 text-white shadow-glow">
                  Criar Primeira Campanha
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {dashboardData.campaigns.map((campaign) => (
              <Card key={campaign.id} className="bg-gradient-card border-border hover:shadow-card transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{campaign.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {campaign.description || "Sem descrição"}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={campaign.active ? "default" : "secondary"}
                      className={campaign.active ? "bg-web3-success" : ""}
                    >
                      {campaign.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Budget Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Budget</span>
                      <span>{(campaign.spent_xlm || 0).toFixed(2)} / {campaign.budget_xlm.toFixed(2)} XLM</span>
                    </div>
                    <Progress 
                      value={((campaign.spent_xlm || 0) / campaign.budget_xlm) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm font-medium">{(campaign.total_impressions || 0).toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Views</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{(campaign.total_clicks || 0).toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Clicks</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{((campaign.total_revenue || 0) * 100).toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">CTR</div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Criada em {new Date(campaign.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}