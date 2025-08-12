import { z } from "zod";

const SearchResultSchema = z.object({
  word: z.string().min(3),
  wordMatched: z.boolean(), // either "word" or "variants" matched in results
});

export type SearchResult = z.infer<typeof SearchResultSchema>;
