export const loadFromLocalStorage = () => {
  const storedData = localStorage.getItem("dataForExcel");
  if (storedData) {
    return JSON.parse(storedData);
  }
  return [];
};

export const saveToLocalStorage = (data) => {
  localStorage.setItem("dataForExcel", JSON.stringify(data));
};

export const resetInputs = () => {
  localStorage.removeItem("dataForExcel");
};

export const checkIfManyIps = (ipInput) => {
  if (ipInput.includes(";")) {
    return ipInput.split(";").filter((ip) => ip.trim() !== "");
  } else return [ipInput];
};

export const checkIfManySids = (sidInput) => {
  if (sidInput.includes(";")) {
    return sidInput.split(";").filter((sid) => sid.trim() !== "");
  } else return [sidInput];
};

export const checkIfManyPorts = (portInput) => {
  if (portInput.includes(";")) {
    return portInput.split(";").filter((port) => port.trim() !== "");
  } else return [portInput];
};

export const checkSIDEntry = (sid) => {
  return true;
};

export const checkPortEntry = (port) => {
  if (port === "") return true;
  const portValue = parseInt(port);
  if (isNaN(portValue) || portValue < 1 || portValue > 65535) {
    console.warn(`Le port ${port} n'est pas valide`);
    return false;
  }
  return true;
};

export const checkIpEntry = (ip) => {
  const ipRegex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (!ipRegex.test(ip) && ip !== "any") {
    console.warn(`L'adresse IP ${ip} n'est pas valide`);
    return false;
  }
  return true;
};

export const saveDataToLocalStorage = (data) => {
  localStorage.setItem("dataForExcel", JSON.stringify(data));
};

export const saveDataToLocalStoragev2 = (data) => {
  localStorage.setItem("SELKSAlerts", JSON.stringify(data));
};
