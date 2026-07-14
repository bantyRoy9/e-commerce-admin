import API from "./api";

export const getDashboard =
async () => {

const response =
await API.get(
"/",
);

return response.data;

};