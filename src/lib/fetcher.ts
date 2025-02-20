import axios from "axios";

const fetcher = async <T>(url: string) => {
  const response = await axios.get<T>(url);
  return response.data;
};

export { fetcher };
