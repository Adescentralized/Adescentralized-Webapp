import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, Target, Users, Globe, Zap, UploadCloud, FileImage, Video, X, Loader2 } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"
import { useAuth } from "@/contexts/AuthContext"
import { apiService } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

type MediaFile = { 
  url: string; 
  type: 'image' | 'video';
  file: File;
};

export default function CreateCampaign() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [dragging, setDragging] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  
  // Form fields
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [targetUrl, setTargetUrl] = useState("")
  const [budgetXlm, setBudgetXlm] = useState("")
  const [costPerClick, setCostPerClick] = useState("")
  const [tags, setTags] = useState("")
  const [category, setCategory] = useState("")
  
  const { user, token } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleFiles = (files: FileList | null) => {
    if (files) {
      const newFiles: MediaFile[] = Array.from(files).map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? 'video' : 'image',
        file: file
      }));

      if (mediaFiles.length + newFiles.length > 3) {
        console.log("Limite de 3 arquivos atingido");
        return
      }

      setMediaFiles(prev => [...prev, ...newFiles])
    }
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
      e.dataTransfer.clearData()
    }
  }

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    if (selectedPreviewIndex >= index) {
      setSelectedPreviewIndex(prev => Math.max(0, prev - 1));
    }
  }

  const handleSubmit = async () => {
    if (!user || !token) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar uma campanha",
        variant: "destructive",
      })
      return
    }

    if (!title || !targetUrl || !budgetXlm || !costPerClick || mediaFiles.length === 0) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios e adicione pelo menos uma imagem",
        variant: "destructive",
      })
      return
    }

    const budgetNum = parseFloat(budgetXlm)
    const costNum = parseFloat(costPerClick)

    if (isNaN(budgetNum) || budgetNum <= 0) {
      toast({
        title: "Erro",
        description: "O orçamento deve ser um valor numérico positivo",
        variant: "destructive",
      })
      return
    }

    if (isNaN(costNum) || costNum <= 0) {
      toast({
        title: "Erro",
        description: "O custo por clique deve ser um valor numérico positivo",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('targetUrl', targetUrl)
      formData.append('budgetXlm', budgetXlm)
      formData.append('costPerClick', costPerClick)
      formData.append('tags', tags)
      
      // Adiciona apenas a primeira imagem (conforme API)
      if (mediaFiles[0]) {
        formData.append('campaignImage', mediaFiles[0].file)
      }

      const response = await apiService.createCampaign(formData, token)
      
      toast({
        title: "Sucesso",
        description: "Campanha criada com sucesso!",
      })
      
      navigate("/")
    } catch (error) {
      toast({
        title: "Erro ao criar campanha",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Create New Campaign
        </h1>
        <p className="text-muted-foreground mt-2">
          Launch your Web3 marketing campaign to reach your target audience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-web3-primary" />
                Campaign Details
              </CardTitle>
              <CardDescription>
                Set up the basic information for your campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter campaign title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your campaign objectives and target audience"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="targetUrl">Target URL</Label>
                  <Input 
                    id="targetUrl" 
                    type="url" 
                    placeholder="https://example.com" 
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (XLM)</Label>
                    <Input 
                      id="budget" 
                      type="number" 
                      step="0.0000001"
                      placeholder="0" 
                      value={budgetXlm}
                      onChange={(e) => setBudgetXlm(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="costPerClick">Cost per Click (XLM)</Label>
                    <Input 
                      id="costPerClick" 
                      type="number" 
                      step="0.0000001"
                      placeholder="0.001" 
                      value={costPerClick}
                      onChange={(e) => setCostPerClick(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input 
                    id="tags" 
                    placeholder="crypto, nft, defi" 
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ad Creative Upload */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-web3-accent" />
                Ad Creative
              </CardTitle>
              <CardDescription>
                Upload your campaign media (up to 3 files) and see a preview
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                className={`p-4 border-2 border-dashed rounded-lg text-center flex flex-col items-center justify-center space-y-2 transition-colors ${dragging ? 'border-primary bg-primary/10' : 'border-border'}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">
                  <Label htmlFor="file-upload" className="text-primary font-semibold cursor-pointer hover:underline">
                    Click to upload
                  </Label>
                  {' '}or drag and drop
                </p>
                <Input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/gif, video/mp4"
                  onChange={(e) => handleFiles(e.target.files)}
                  multiple
                />
                <div className="text-xs text-muted-foreground space-y-1 pt-2">
                  <p>Up to 3 files</p>
                  <p>Max file size: 5MB</p>
                  <p>Allowed: PNG, JPG, GIF, MP4</p>
                  <p>Recommended dimensions: 1080x1080</p>
                </div>
              </div>
              
              {/* Ad Preview */}
              <div className="space-y-2">
                <Label>Ad Preview</Label>
                <div className="aspect-square bg-muted/20 rounded-lg flex items-center justify-center overflow-hidden">
                  {mediaFiles.length > 0 ? (
                    mediaFiles[selectedPreviewIndex].type === 'video' ? (
                      <video src={mediaFiles[selectedPreviewIndex].url} className="w-full h-full object-cover" controls autoPlay loop muted />
                    ) : (
                      <img src={mediaFiles[selectedPreviewIndex].url} alt="Ad preview" className="w-full h-full object-cover" />
                    )
                  ) : (
                    <div className="text-center text-muted-foreground p-4">
                      <FileImage className="h-8 w-8 mx-auto" />
                      <p>Your ad creative will appear here</p>
                    </div>
                  )}
                </div>
                {mediaFiles.length > 1 && (
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {mediaFiles.map((media, index) => (
                      <div 
                        key={index} 
                        className={`relative aspect-square rounded-md overflow-hidden cursor-pointer ${index === selectedPreviewIndex ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
                        onClick={() => setSelectedPreviewIndex(index)}
                      >
                        {media.type === 'video' ? (
                          <video src={media.url} className="w-full h-full object-cover" muted />
                        ) : (
                          <img src={media.url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                        )}
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-1 right-1 h-5 w-5"
                          onClick={(e) => { e.stopPropagation(); removeMedia(index); }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Targeting */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-web3-secondary" />
                Targeting
              </CardTitle>
              <CardDescription>
                Define your target audience and demographics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-24">18-24</SelectItem>
                      <SelectItem value="25-34">25-34</SelectItem>
                      <SelectItem value="35-44">35-44</SelectItem>
                      <SelectItem value="45-54">45-54</SelectItem>
                      <SelectItem value="55+">55+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">Interests</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select interests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      <SelectItem value="nft">NFTs</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platforms">Platforms</Label>
                <div className="grid grid-cols-2 gap-4">
                  {["Twitter", "Discord", "Telegram", "Reddit"].map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Switch id={platform} />
                      <Label htmlFor={platform}>{platform}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-web3-accent" />
                Schedule
              </CardTitle>
              <CardDescription>
                Set the campaign duration and schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-web3-primary" />
                Campaign Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="h-32 bg-muted/20 rounded-lg flex items-center justify-center">
                <div className="text-muted-foreground">Preview will appear here</div>
              </div>
              <p className="text-sm text-muted-foreground">
                Preview how your campaign will appear to users
              </p>
            </CardContent>
          </Card>

          {/* Estimated Reach */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-web3-secondary" />
                Estimated Reach
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-web3-primary">15.2K</div>
                <div className="text-sm text-muted-foreground">Potential impressions</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Cost per impression</span>
                  <span>$0.02</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Estimated clicks</span>
                  <span>890</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Click-through rate</span>
                  <span>5.8%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              className="w-full bg-gradient-primary hover:opacity-90 text-white shadow-glow"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Campaign'
              )}
            </Button>
            <Button variant="outline" className="w-full" disabled={isLoading}>
              Save as Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}