import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function encryptPassword(password) {
    const salt = await bcrypt.genSalt(10);

    let hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
}

export async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

export async function createToken(payload) {
    const token = jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: "1d" });

    return token;
}

export async function decodeToken(token) {
    const decodedTokenData = jwt.verify(token, process.env.SECRET_TOKEN);
    
    return decodedTokenData;
}