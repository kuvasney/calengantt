import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

worker.start({
  onUnhandledRequest: "bypass", // Passa através requests não mockadas
});
