import { http, HttpResponse } from "msw";
import MOCK_USERS from "./Users.json";
import MOCK_PRODUCTS from "./Products.json";
import MOCK_PROJECTS from "./Projects.json";

const API_BASE_URL = "https://calengantt.com/api";

export const handlers = [
  http.get(`${API_BASE_URL}/user`, () => {
    return HttpResponse.json(MOCK_USERS);
  }),
  http.get(`${API_BASE_URL}/projects`, () => {
    return HttpResponse.json(MOCK_PROJECTS);
  }),
  http.get(`${API_BASE_URL}/products`, () => {
    return HttpResponse.json(MOCK_PRODUCTS);
  }),
];
