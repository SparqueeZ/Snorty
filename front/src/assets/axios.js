import axios from "axios";

const checkAPIURL = (APIURL) => {
  if (!APIURL) {
    window.alert("URL de l'API non renseignée : ", APIURL);
  }

  return APIURL;
};

const instance = axios.create({
  baseURL: checkAPIURL(import.meta.env.VITE_SELKSC_API_URL),
  withCredentials: true,
});

export default instance;
