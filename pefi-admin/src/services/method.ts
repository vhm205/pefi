import { api } from "./api";

const METHODS_ENDPOINT = "/api/methods";

export const methodService = {
  getAll: () =>
    api.get<string[]>(
      `${METHODS_ENDPOINT}`
    )
};