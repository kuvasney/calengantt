import { http, HttpResponse, delay } from "msw";
import MOCK_USER from "./User.json";
import MOCK_NEW_USER from "./NewUser.json";
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
  http.post(`${API_BASE_URL}/user/login`, async () => {
    await delay(1000);
    return HttpResponse.json(MOCK_USER);
  }),
  http.post(`${API_BASE_URL}/user/register`, async () => {
    await delay(1000);
    return HttpResponse.json(MOCK_NEW_USER);
  }),
  http.post(`${API_BASE_URL}/user/password-recovery`, async () => {
    await delay(1000);
    return HttpResponse.json({ message: "Password recovery email sent." });
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
    // await delay(2000);
    return HttpResponse.json(MOCK_PROJECT);
  }),

  http.post(`${API_BASE_URL}/project`, async () => {
    // await delay(2000);
    return HttpResponse.json(MOCK_NEW_PROJECT);
  }),

  http.patch(`${API_BASE_URL}/project/*`, async ({ request }) => {
    await delay(500);
    const body = await request.json();
    // Em produção, o servidor mesclaria os dados e retornaria o projeto atualizado
    // Aqui apenas retornamos sucesso com os dados enviados
    return HttpResponse.json({ ...MOCK_PROJECT, ...body });
  }),
];
