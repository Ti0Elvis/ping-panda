import { z } from "zod";

export const EVENT_CATEGORY_NAME_VALIDATOR = z
  .string()
  .min(1, "Category name is required.")
  .regex(
    /^[a-zA-Z0-9-]+$/,
    "Category name can only contain letters, numbers or hyphens."
  )
  .trim()
  .transform((value) => {
    const lower = value.toLowerCase();

    return lower.charAt(0).toUpperCase() + lower.slice(1);
  });
