import { z } from "zod";

export const statusEnum = z.enum(['WISHLIST', 'READING', 'FINISHED']);
