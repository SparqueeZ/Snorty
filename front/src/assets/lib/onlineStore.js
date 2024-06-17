import axios from "axios";

export const insertRule = async (data) => {
  console.log(data);
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SELKSC_API_URL}/api/data/storeRule`,
      {
        sid: data.sid,
        rulename: data.rulename,
        modifiers: data.modifiers,
      }
    );

    console.log(response);
  } catch (error) {
    console.error("Erreur lors de la requete HTTP : ", error);
  }
};

export const updateRule = async (rule) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SELKSC_API_URL}/api/data/updateRule`,
      {
        rule,
      }
    );
  } catch (error) {
    console.error("Erreur lors de la requete HTTP : ", error);
  }
};

export const updateAlert = async (id, alert) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SELKSC_API_URL}/api/data/updateAlert`,
      {
        id: id,
        alert: alert,
      }
    );

    console.log(response);
  } catch (error) {
    console.error("Erreur lors de la requete HTTP : ", error);
  }
};

export const removeAlert = async (id) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SELKSC_API_URL}/api/data/removeAlert`,
      {
        id: id,
      }
    );

    console.log(response);
  } catch (error) {
    console.error("Erreur lors de la requete HTTP : ", error);
  }
};

export const storeAlert = async (alert) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SELKSC_API_URL}/api/data/storeAlert`,
      {
        alert: JSON.parse(alert),
      }
    );

    console.log(response);
  } catch (error) {
    console.error("Erreur lors de la requete HTTP : ", error);
  }
};

export const getCurrentDate = () => {
  const now = new Date();
  const Year = now.getFullYear();
  const Month = String(now.getMonth() + 1).padStart(2, "0");
  const Day = String(now.getDate()).padStart(2, "0");
  const Hours = String(now.getHours()).padStart(2, "0");
  const Minutes = String(now.getMinutes()).padStart(2, "0");
  const Seconds = String(now.getSeconds()).padStart(2, "0");
  return `${Year}/${Month}/${Day} à ${Hours}:${Minutes}:${Seconds}`;
};
