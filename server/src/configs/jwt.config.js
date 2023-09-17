import util from "util";
import crypto from "crypto";

export const randomBytesAsync = util.promisify(crypto.randomBytes);
export const pbkdf2Async = util.promisify(crypto.pbkdf2);

export const secret = "4fsd4f6s54f6d5s46";