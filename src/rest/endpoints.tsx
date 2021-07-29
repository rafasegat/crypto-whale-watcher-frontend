import axios from "axios";

axios.defaults.baseURL = "https://crypto-whale-watcher-prod.herokuapp.com/";

export const getTransactions = async (filter: TypeFilter, done: Function) => {
  const { data } = await axios.get(
    `/transactions?symbol=${filter.symbol}&period=${filter.period}`
  );
  done(data.results);
};
