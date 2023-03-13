import { registerHandlebarsHelpers } from "./helpers.mjs";
import { preloadHandlebarsTemplates } from "./templates.mjs";

export const initializeHandlebars = () => {
  registerHandlebarsHelpers();
  preloadHandlebarsTemplates();
};