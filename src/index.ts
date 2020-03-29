import axios from "axios"



interface QuoteResponse {
  result : Quote[];
  error : string;
}

interface Quote {
  language: string;
  region: string;
  quoteType: string;
  triggerable: number;
  quoteSourceName: string;
  currency: string;
  regularMarketPreviousClose: number;
  bid: number;
  ask: number;
  bidSize: number;
  askSize: number;
  fullExchangeName: string;
  financialCurrency: string;
  regularMarketOpen: number;
  averageDailyVolume3Month: number;
  averageDailyVolume10Day: number;
  fiftyTwoWeekLowChange: number;
  fiftyTwoWeekLowChangePercent: number;
  fiftyTwoWeekRange: string;
  fiftyTwoWeekHighChange: number;
  fiftyTwoWeekHighChangePercent: number;
  exchange: string;
  shortName: string;
  longName: string;
  messageBoardId: string;
  exchangeTimezoneName: string;
  exchangeTimezoneShortName: string;
  gmtOffSetMilliseconds: number;
  market: string;
  esgPopulated: number;
  sharesOutstanding: number;
  fiftyDayAverage: number;
  fiftyDayAverageChange: number;
  fiftyDayAverageChangePercent: number;
  twoHundredDayAverage: number;
  twoHundredDayAverageChange: number;
  twoHundredDayAverageChangePercent: number;
  marketCap: number;
  sourceInterval: number;
  exchangeDataDelayedBy: number;
  tradeable: number;
  firstTradeDateMilliseconds: number;
  priceHint: number;
  postMarketChangePercent: number;
  postMarketTime: number;
  postMarketPrice: number;
  postMarketChange: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketTime: number;
  regularMarketPrice: number;
  regularMarketDayHigh: number;
  regularMarketDayRange: string;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekHigh: number;
  ytdReturn: number;
  trailingThreeMonthReturns: number;
  trailingThreeMonthNavReturns: number;
  marketState: string;
  symbol: string
}

const queryUrl = "https://query1.finance.yahoo.com/v7/finance"

export function quote(symbol : string) : Promise<Quote> {
  return axios.get(`${queryUrl}/quote?symbol=${symbol}`)
  .then(res => {
    let results = (res.data as QuoteResponse).result
  if(results.length > 0){
    return results[0]
  }else{
    throw new Error(`Symbol ${symbol} was not found`)
  }})
} 

export default {
  quote : quote
}