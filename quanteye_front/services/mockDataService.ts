
import type { PortfolioMetrics, AssetRecommendation, TimeSeriesData, DrawdownData } from '../types';

class MockDataService {
  private generateRandom(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  public generateMetrics(): PortfolioMetrics {
    const portfolio_cagr = this.generateRandom(25, 80);
    const btc_cagr = this.generateRandom(20, 60);
    const portfolio_sharpe = this.generateRandom(1.2, 2.5);
    const btc_sharpe = this.generateRandom(0.8, 1.8);
    const portfolio_mdd = this.generateRandom(15, 35);
    const btc_mdd = this.generateRandom(20, 45);

    return {
      portfolio_cagr,
      btc_cagr,
      portfolio_sharpe,
      btc_sharpe,
      portfolio_mdd,
      btc_mdd,
      win_rate: this.generateRandom(55, 75),
      outperform_rate: this.generateRandom(51, 65),
    };
  }

  public generateRecommendations(): AssetRecommendation[] {
    const assets = ['BTC', 'ETH', 'SOL', 'AVAX', 'LINK', 'MATIC', 'ADA', 'DOT'];
    const recommendations: AssetRecommendation[] = [];
    const date = new Date().toISOString().split('T')[0];

    const selectedAssets = assets.sort(() => 0.5 - Math.random()).slice(0, 5);
    let remainingWeight = 100;
    
    selectedAssets.forEach((asset, index) => {
      const isLast = index === selectedAssets.length - 1;
      const weight = isLast ? remainingWeight : this.generateRandom(10, Math.min(30, remainingWeight - (selectedAssets.length-1-index)*10));
      remainingWeight -= weight;
      
      recommendations.push({
        date,
        asset,
        weight: weight,
        exp_ret: this.generateRandom(0.05, 0.2),
        exp_vol: this.generateRandom(0.5, 1.5),
        sharpe: this.generateRandom(1.0, 2.5),
      });
    });

    return recommendations;
  }

  public generateCumulativeReturns(days = 180): TimeSeriesData[] {
    const data: TimeSeriesData[] = [];
    let portfolioValue = 1;
    let btcValue = 1;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      portfolioValue *= 1 + this.generateRandom(-0.025, 0.035);
      btcValue *= 1 + this.generateRandom(-0.03, 0.032);
      
      data.push({
        date: date.toISOString().split('T')[0],
        portfolio: portfolioValue,
        btc: btcValue
      });
    }
    return data;
  }
  
  public generateDrawdown(returnData: TimeSeriesData[]): DrawdownData[] {
    let peak = 0;
    return returnData.map(d => {
        peak = Math.max(peak, d.portfolio);
        const drawdown = (peak - d.portfolio) / peak;
        return {
            date: d.date,
            drawdown: -drawdown * 100 // as percentage
        };
    });
  }

  public generateAllData() {
    const metrics = this.generateMetrics();
    const recommendations = this.generateRecommendations();
    const cumulativeReturns = this.generateCumulativeReturns();
    const drawdown = this.generateDrawdown(cumulativeReturns);

    return {
        metrics,
        recommendations,
        cumulativeReturns,
        drawdown
    };
  }
}

export const mockDataService = new MockDataService();
