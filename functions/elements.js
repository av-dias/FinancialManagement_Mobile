export const setElementValueById = (id, name) => {
  document.getElementById(id).value = name;
};

export const getElementValueById = (id) => {
  return document.getElementById(id).value;
};

export const clearElementValueById = (id) => {
  document.getElementById(id).value = "";
};

//incorrectLoginHandle email password
