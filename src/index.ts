import axios from "axios";
import moment from "moment";

interface QuoteResponse {
  result: Quote[];
  error: string;
}

export interface ContractData {
  contractSymbol?: string;
  strike?: number;
  currency?: string;
  lastPrice?: number;
  change?: number;
  percentChange?: number;
  volume?: number;
  openInterest?: number;
  bid?: number;
  ask?: number;
  contractSize?: string;
  expiration?: number;
  lastTradeDate?: number;
  impliedVolatility?: number;
  inTheMoney?: boolean;
}

export interface ContractDataByStrike {
  [strike: number]: ContractData | undefined;
}

export interface OptionChain {
  call: ContractDataByStrike;
  put: ContractDataByStrike;
}

export interface Expiration {
  expirationString: string;
  expirationTimestamp: number;
}

export interface OptionMeta {
  strikes: number[];
  expirations: Expiration[];
}

export interface Quote {
  language?: string;
  region?: string;
  quoteType?: string;
  triggerable?: number;
  quoteSourceName?: string;
  currency?: string;
  regularMarketPreviousClose?: number;
  bid?: number;
  ask?: number;
  bidSize?: number;
  askSize?: number;
  fullExchangeName?: string;
  financialCurrency?: string;
  regularMarketOpen?: number;
  averageDailyVolume3Month?: number;
  averageDailyVolume10Day?: number;
  fiftyTwoWeekLowChange?: number;
  fiftyTwoWeekLowChangePercent?: number;
  fiftyTwoWeekRange?: string;
  fiftyTwoWeekHighChange?: number;
  fiftyTwoWeekHighChangePercent?: number;
  exchange?: string;
  shortName?: string;
  longName?: string;
  messageBoardId?: string;
  exchangeTimezoneName?: string;
  exchangeTimezoneShortName?: string;
  gmtOffSetMilliseconds?: number;
  market?: string;
  esgPopulated?: number;
  sharesOutstanding?: number;
  fiftyDayAverage?: number;
  fiftyDayAverageChange?: number;
  fiftyDayAverageChangePercent?: number;
  twoHundredDayAverage?: number;
  twoHundredDayAverageChange?: number;
  twoHundredDayAverageChangePercent?: number;
  marketCap?: number;
  sourceInterval?: number;
  exchangeDataDelayedBy?: number;
  tradeable?: number;
  firstTradeDateMilliseconds?: number;
  priceHint?: number;
  postMarketChangePercent?: number;
  postMarketTime?: number;
  postMarketPrice?: number;
  postMarketChange?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketTime?: number;
  regularMarketPrice?: number;
  regularMarketDayHigh?: number;
  regularMarketDayRange?: string;
  regularMarketDayLow?: number;
  regularMarketVolume?: number;
  fiftyTwoWeekLow?: number;
  fiftyTwoWeekHigh?: number;
  ytdReturn?: number;
  trailingThreeMonthReturns?: number;
  trailingThreeMonthNavReturns?: number;
  marketState?: string;
  symbol?: string;
}

function makeLookup(data: ContractData[]): ContractDataByStrike {
  let result = {} as ContractDataByStrike;
  data.forEach(contract => {
    if (contract.strike) {
      result[contract.strike] = contract;
    }
  });
  return result;
}

export default class YahooFinance {
  queryUrl: string;

  constructor(urlBase?: string) {
    this.queryUrl = urlBase || "https://query1.finance.yahoo.com/v7/finance";
  }

  quote(symbol: string): Promise<Quote> {
    return axios.get(`${this.queryUrl}/quote?symbols=${symbol}`).then(res => {
      let results = (res.data.quoteResponse as QuoteResponse).result;
      if (results.length > 0) {
        return results[0];
      } else {
        throw new Error(`Symbol ${symbol} was not found`);
      }
    });
  }

  options(symbol: string, expiration: number): Promise<OptionChain> {
    return axios
      .get(`${this.queryUrl}/options/${symbol}?date=${expiration}`)
      .then(res => {
        let results = res.data.optionChain.result;
        if (results.length > 0) {
          let calls = results[0].options[0].calls as ContractData[];
          let puts = results[0].options[0].puts as ContractData[];
          return { call: makeLookup(calls), put: makeLookup(puts) };
        } else {
          throw new Error(`Symbol ${symbol} was not found`);
        }
      });
  }

  optionMeta(symbol: string): Promise<OptionMeta> {
    return axios.get(`${this.queryUrl}/options/${symbol}`).then(res => {
      let results = res.data.optionChain.result;
      if (results.length > 0) {
        let expirationsUnix = results[0].expirationDates as number[];
        return {
          expirations: expirationsUnix.map(e => ({
            expirationString: moment
              .unix(e)
              .utc()
              .format("MM/DD"),
            expirationTimestamp: e
          })),
          strikes: results[0].strikes as number[]
        };
      } else {
        throw new Error(`Symbol ${symbol} was not found`);
      }
    });
  }
}
