// Serviço de desenvolvimento para simular dados quando o backend está incompleto
export const devMockService = {
  // Mock user data
  getMockUser: (email: string) => ({
    id: '1',
    email: email,
    name: email.split('@')[0].replace(/[._]/g, ' ').split(' ').map(s => 
      s.charAt(0).toUpperCase() + s.slice(1)
    ).join(' '),
    publicKey: 'GCKFBEIYTKP5RDRFDZJUFN3K4D3SQU3KZJPSFWKH7XBGZQ9J3QGDNVTJ'
  }),

  // Mock wallet data
  getMockWallet: () => ({
    publicKey: 'GCKFBEIYTKP5RDRFDZJUFN3K4D3SQU3KZJPSFWKH7XBGZQ9J3QGDNVTJ',
    account: {
      balances: [
        {
          asset_type: 'native',
          balance: '1000.0000000'
        }
      ]
    }
  }),

  // Mock dashboard data
  getMockDashboard: () => ({
    user: {
      id: '1',
      email: 'user@example.com',
      publicKey: 'GCKFBEIYTKP5RDRFDZJUFN3K4D3SQU3KZJPSFWKH7XBGZQ9J3QGDNVTJ',
      userType: 'advertiser'
    },
    campaigns: [
      {
        id: '1',
        title: 'Sample Campaign',
        description: 'This is a sample campaign for demonstration',
        budget_xlm: 100,
        spent_xlm: 25,
        active: true,
        total_impressions: 1500,
        total_clicks: 75,
        total_revenue: 0.05,
        created_at: new Date().toISOString()
      }
    ],
    sites: [],
    summary: {
      totalCampaigns: 1,
      totalSites: 0,
      totalClicks: 75,
      totalImpressions: 1500,
      totalSpent: 25
    }
  }),

  // Mock profile data
  getMockProfile: () => ({
    user: {
      id: '1',
      email: 'user@example.com',
      name: 'John Doe',
      publicKey: 'GCKFBEIYTKP5RDRFDZJUFN3K4D3SQU3KZJPSFWKH7XBGZQ9J3QGDNVTJ',
      userType: 'advertiser',
      created_at: '2024-01-15T10:30:00Z',
      bio: 'Web3 marketing specialist focused on DeFi and NFT projects.',
      website: 'https://johndoe.crypto',
      twitter: '@johndoecrypto'
    },
    campaigns: [
      {
        id: '1',
        title: 'DeFi Protocol Launch',
        active: true,
        budget_xlm: 500,
        spent_xlm: 125,
        total_impressions: 15200,
        total_clicks: 890,
        created_at: '2024-01-20T14:00:00Z'
      },
      {
        id: '2',
        title: 'NFT Collection Drop',
        active: false,
        budget_xlm: 300,
        spent_xlm: 300,
        total_impressions: 8500,
        total_clicks: 425,
        created_at: '2024-02-01T09:15:00Z'
      }
    ],
    stats: {
      totalCampaigns: 12,
      totalSpent: 2340,
      successRate: 87,
      memberSince: '2024-01-01T00:00:00Z'
    }
  }),

  // Check if we should use mock data (when backend is not available)
  shouldUseMock: (error: any): boolean => {
    return error.message.includes('fetch') || 
           error.message.includes('NetworkError') ||
           error.message.includes('Failed to fetch');
  }
};

export default devMockService;
