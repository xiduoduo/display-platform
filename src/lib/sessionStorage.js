// 本地存储
const setStorage = (name, value) => {
  sessionStorage.setItem(name, JSON.stringify(value));
};

const getStorage = (name) => {
  return JSON.parse(sessionStorage.getItem(name));
};

const setLocalStorage = (name, value) => {
  localStorage.setItem(name, JSON.stringify(value));
};

const getLocalStorage = (name) => {
  return JSON.parse(localStorage.getItem(name));
};

const removeStorage = (name) => {
  sessionStorage.removeItem(name);
  localStorage.removeItem(name);
};

export { setStorage, getStorage, removeStorage, setLocalStorage, getLocalStorage };
