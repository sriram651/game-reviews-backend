import { GraphQLError } from "graphql";
import User from "../../models/User.js";
import { comparePassword, createToken, encryptPassword } from "../../utils/userAuth.js";

const pingServer = async () => {
    return {
        success: true,
        message: 'Pong!',
    };
};

const registerNewUser = async (_, args) => {
    try {
        let { userName, email, password, role } = args.newUser;

        let existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new GraphQLError('Email is already registered!', {
                path: 'registerNewUser',
                extensions: {
                    code: "BAD_REQUEST",
                    http: {
                        status: 201,
                    },
                }
            });
        }

        let existingUserName = await User.findOne({ userName });

        if (existingUserName) {
            throw new GraphQLError('Username is already taken!', {
                path: 'registerNewUser',
                extensions: {
                    code: "BAD_REQUEST",
                    http: {
                        status: 201,
                    },
                }
            });
        }

        if (password.length < 8) {
            throw new GraphQLError('Password must be at least 8 characters long!', {
                path: 'registerNewUser',
                extensions: {
                    code: "BAD_REQUEST",
                    http: {
                        status: 201,
                    },
                }
            });
        }

        const hashedPassword = await encryptPassword(password);

        let newUser = await User.create({
            userName,
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        let token = await createToken({
            userId: newUser._id,
            email: newUser.email,
            role: newUser.role,
        });

        return {
            id: newUser._id,
            ...newUser._doc,
            token,
        };
    } catch (error) {
        throw new GraphQLError(error.message, {
            path: 'registerNewUser',
            extensions: error.extensions
        });
    }
};

const loginUser = async (_, args) => {
    try {
        let { email, password } = args.userLogin;

        let user = await User.findOne({ email });

        if (!user) {
            throw new GraphQLError('Email not registered!', {
                path: 'loginUser',
                extensions: {
                    code: "NOT_FOUND",
                    http: {
                        status: 201,
                    },
                }
            });
        }

        let isValidPassword = await comparePassword(password, user.password);

        if (!isValidPassword) {
            throw new GraphQLError('Incorrect password!', {
                path: 'loginUser',
                extensions: {
                    code: "BAD_REQUEST",
                    http: {
                        status: 201,
                    },
                }
            });
        }

        let token = await createToken({
            userId: user._id,
            email: user.email,
            role: user.role,
        });

        return {
            id: user._id,
            ...user._doc,
            token,
        };
    } catch (error) {
        throw new GraphQLError(error.message, {
            path: 'loginUser',
            extensions: error.extensions
        });
    }
};

export const authQueries = {
    pingServer,
};

export const authMutations = {
    registerNewUser,
    loginUser,
};