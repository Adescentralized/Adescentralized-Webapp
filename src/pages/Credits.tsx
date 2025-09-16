import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Plus, Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Send, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useState, useEffect } from "react"
import { apiService } from "@/services/api"
import { useToast } from "@/hooks/use-toast"

const creditPackages = [
  {
    amount: 100,
    price: 10,
    bonus: 0,
    popular: false,
  },
  {
    amount: 500,
    price: 45,
    bonus: 50,
    popular: true,
  },
  {
    amount: 1000,
    price: 80,
    bonus: 200,
    popular: false,
  },
  {
    amount: 2500,
    price: 180,
    bonus: 500,
    popular: false,
  },
]

const transactions = [
  {
    id: 1,
    type: "purchase",
    amount: 500,
    credits: 550,
    date: "2024-03-15",
    status: "completed",
    method: "Credit Card"
  },
  {
    id: 2,
    type: "spend",
    amount: -120,
    campaign: "Summer NFT Collection",
    date: "2024-03-14",
    status: "completed"
  },
  {
    id: 3,
    type: "purchase",
    amount: 100,
    credits: 100,
    date: "2024-03-10",
    status: "completed",
    method: "ETH"
  },
  {
    id: 4,
    type: "spend",
    amount: -85,
    campaign: "DeFi Protocol Awareness",
    date: "2024-03-08",
    status: "completed"
  },
]

export default function Credits() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [walletData, setWalletData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [transferLoading, setTransferLoading] = useState(false)
  
  // Transfer form states
  const [toPublicKey, setToPublicKey] = useState("")
  const [amount, setAmount] = useState("")

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!user?.email || !token) return

      try {
        setIsLoading(true)
        const data = await apiService.getWallet(user.email, token)
        setWalletData(data)
      } catch (error) {
        toast({
          title: "Erro ao carregar dados da carteira",
          description: error instanceof Error ? error.message : "Erro desconhecido",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchWalletData()
  }, [user?.email, token, toast])

  const handleTransfer = async () => {
    if (!user?.email || !token) return

    if (!toPublicKey || !amount) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      })
      return
    }

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Erro",
        description: "O valor deve ser um número positivo",
        variant: "destructive",
      })
      return
    }

    setTransferLoading(true)

    try {
      await apiService.transfer({
        fromEmail: user.email,
        toPublicKey,
        amount: amountNum
      }, token)
      
      toast({
        title: "Sucesso",
        description: "Transferência realizada com sucesso!",
      })
      
      // Reset form
      setToPublicKey("")
      setAmount("")
      
      // Refresh wallet data
      const data = await apiService.getWallet(user.email, token)
      setWalletData(data)
    } catch (error) {
      toast({
        title: "Erro na transferência",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setTransferLoading(false)
    }
  }

  const currentBalance = walletData?.account?.balances?.find((b: any) => b.asset_type === 'native')?.balance || 0

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Credits & Billing
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your campaign credits and billing information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Balance */}
        <div className="lg:col-span-1">
          <Card className="bg-gradient-primary border-0 text-white shadow-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">
                {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : `${parseFloat(currentBalance).toFixed(2)}`}
              </div>
              <div className="text-white/80">XLM Balance</div>
              <div className="mt-4 text-sm text-white/80">
                Stellar Lumens
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="mt-6 space-y-4">
            <Card className="bg-gradient-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">This Month</div>
                    <div className="text-2xl font-bold text-web3-success">+850</div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-web3-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                    <div className="text-2xl font-bold">2,340</div>
                  </div>
                  <CreditCard className="h-8 w-8 text-web3-secondary" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transfer XLM */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Transfer XLM</h2>
            <p className="text-muted-foreground">
              Send XLM to another Stellar address
            </p>
          </div>

          <Card className="bg-gradient-card border-border mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-web3-primary" />
                Send XLM
              </CardTitle>
              <CardDescription>
                Transfer XLM to another Stellar public key
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="toPublicKey">Recipient Public Key</Label>
                <Input
                  id="toPublicKey"
                  placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  value={toPublicKey}
                  onChange={(e) => setToPublicKey(e.target.value)}
                  disabled={transferLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (XLM)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.0000001"
                  placeholder="0.0000000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={transferLoading}
                />
              </div>

              <Button 
                onClick={handleTransfer}
                disabled={transferLoading || !toPublicKey || !amount}
                className="w-full bg-gradient-primary hover:opacity-90 text-white"
              >
                {transferLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  "Send XLM"
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Purchase Credits</h2>
            <p className="text-muted-foreground">
              Choose a credit package to fund your marketing campaigns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {creditPackages.map((pkg, index) => (
              <Card 
                key={index} 
                className={`bg-gradient-card border-border hover:shadow-card transition-all cursor-pointer relative ${
                  pkg.popular ? 'ring-2 ring-web3-primary' : ''
                }`}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-web3-primary">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{pkg.amount.toLocaleString()}</CardTitle>
                  {pkg.bonus > 0 && (
                    <div className="text-sm text-web3-success">
                      +{pkg.bonus} Bonus Credits
                    </div>
                  )}
                  <CardDescription>Campaign Credits</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-3xl font-bold">${pkg.price}</div>
                  {pkg.bonus > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Total: {(pkg.amount + pkg.bonus).toLocaleString()} credits
                    </div>
                  )}
                  <Button className="w-full bg-gradient-primary hover:opacity-90 text-white">
                    Purchase
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Methods */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                We accept various payment methods including crypto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Credit Card", "ETH", "USDC", "BTC"].map((method) => (
                  <div 
                    key={method}
                    className="p-4 border border-border rounded-lg text-center hover:bg-secondary/50 cursor-pointer transition-all"
                  >
                    <div className="font-medium">{method}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transaction History */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Your recent credit purchases and campaign spending
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id}>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'purchase' 
                        ? 'bg-web3-success/20 text-web3-success' 
                        : 'bg-web3-warning/20 text-web3-warning'
                    }`}>
                      {transaction.type === 'purchase' ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        {transaction.type === 'purchase' ? (
                          `Credit Purchase - ${transaction.credits} credits`
                        ) : (
                          `Campaign Spend - ${transaction.campaign}`
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.date}
                        {transaction.method && ` • ${transaction.method}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${
                      transaction.amount > 0 ? 'text-web3-success' : 'text-foreground'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount).toLocaleString()} credits
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
                {transaction.id !== transactions[transactions.length - 1].id && (
                  <Separator />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}