import { pbkdf2, randomBytes } from "crypto";

const digest = process.env.DIGEST!;
const iterations = parseInt(process.env.ITERATIONS!);
const keyLength = parseInt(process.env.KEY_LENGTH!);
const salt = process.env.SALT!;

console.table({ digest, iterations, keyLength, salt });

const getPasswordHash = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    pbkdf2(password, salt, iterations, keyLength, digest, (err, derivedKey) => {
      if (err) {
        console.log("REJECTING");
        reject(err);
      } else {
        console.log("RESOLVED:", derivedKey.toString("hex"));
        resolve(derivedKey.toString("hex"));
      }
    });
  });
};

export const verifyPassword = async (
  password: string,
  passwordInDb: string
): Promise<boolean> => {
  try {
    const passwordHash = await getPasswordHash(password);
    return passwordHash === passwordInDb;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/*
  Uncomment below to generate your password hash
  Note down the printed values into your .env file
*/
// const salt = randomBytes(16).toString("hex");
// console.log("salt:", salt);
// const password = process.env.PASSWORD!;
// console.log("Password hash:", passwordHash);
