import bcrypt from 'bcrypt';

export const compare = async (string: string, hashedString: string) => {
    return await bcrypt.compare(string, hashedString);
}

export const hash = async (textToHash: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(textToHash,salt);

    return hashed
}