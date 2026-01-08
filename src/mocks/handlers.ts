import { http, HttpResponse, delay } from "msw";
import MOCK_USERS from "./Users.json";
import MOCK_PRODUCTS from "./Products.json";
import MOCK_PROJECTS from "./Projects.json";
import MOCK_NEW_PROJECT from "./ProjectsNew.json";
import MOCK_PROJECT from "./Project.json";
import MOCK_COMMENTS from "./Comments.json";

const API_BASE_URL = "https://calengantt.com/api";

export const handlers = [
  http.get(`${API_BASE_URL}/user`, () => {
    return HttpResponse.json(MOCK_USERS);
  }),

  http.get(`${API_BASE_URL}/products`, () => {
    return HttpResponse.json(MOCK_PRODUCTS);
  }),

  http.get(`${API_BASE_URL}/projects`, () => {
    return HttpResponse.json(MOCK_PROJECTS);
  }),

  http.get(`${API_BASE_URL}/project/*/comments`, async () => {
    await delay(1000);
    return HttpResponse.json(MOCK_COMMENTS);
  }),

  http.get(`${API_BASE_URL}/project/*`, async () => {
    await delay(2000);
    return HttpResponse.json(MOCK_PROJECT);
  }),

  http.post(`${API_BASE_URL}/project`, async () => {
    await delay(2000);
    return HttpResponse.json(MOCK_NEW_PROJECT);
  }),
];
