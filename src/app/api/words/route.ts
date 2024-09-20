import { getWordList } from "@/lib/actions-server-only";

export const GET = async () => {
  try {
    const result = await getWordList();
    return Response.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Something went wrong" }, { status: 400 });
  }
};
