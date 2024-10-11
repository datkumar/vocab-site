import bcrypt from "bcrypt";

const getPasswordHash = async (password: string): Promise<string | null> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 11);
    return hashedPassword;
  } catch (error) {
    console.log("Error hashing password", error);
    return null;
  }
};

export const verifyPassword = async (
  userFilledPassword: string,
  passwordInDb: string
): Promise<boolean> => {
  try {
    const isMatched = await bcrypt.compare(userFilledPassword, passwordInDb);
    return isMatched;
  } catch (error) {
    console.log("Error while checking password", error);
    throw new Error("Error while checking password");
  }
};

/*
  Uncomment below to generate your password hash
  Note down the printed values into your .env file
*/
// const salt = randomBytes(16).toString("hex");
// console.log("salt:", salt);
const password = process.env.PASSWORD!;
const passwordHash = await getPasswordHash(password);
console.log("Password hash:", passwordHash);
