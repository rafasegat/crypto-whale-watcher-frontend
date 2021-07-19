import axios from "axios";

axios.defaults.baseURL = "https://crypto-whale-watcher-prod.herokuapp.com/";

export const getTransactions = async (symbol: string, done: Function) => {
  const { data } = await axios.get(`/transactions?symbol=${symbol}`);
  done(data.results);
};
