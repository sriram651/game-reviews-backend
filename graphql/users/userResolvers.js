import { GraphQLError } from "graphql";
import User from "../../models/User.js";

const changeUserRole = async (_, args, context) => {
    try {
        let { email, role } = args;

        if (!context.user.userId) {
            throw new GraphQLError('User not authenticated!', {
                extensions: {
                    code: "UNAUTHENTICATED",
                    http: {
                        status: 401,
                    },
                }
            });
        }

        if (context.user.role !== "SUPER_ADMIN") {
            throw new GraphQLError('You do not have authorization!', {
                extensions: {
                    code: "UNAUTHORIZED",
                    http: {
                        status: 401,
                    },
                }
            });
        }

        let user = await User.findOneAndUpdate(
            { email },
            {
                role,
                updatedAt: new Date().toISOString()
            },
            { new: true }
        );

        if (!user) {
            throw new GraphQLError('User not found!', {
                extensions: {
                    code: "NOT_FOUND",
                    http: {
                        status: 404,
                    },
                }
            });
        }

        return user;
    } catch (error) {
        throw new GraphQLError(error.message, {
            path: 'changeUserRole',
            extensions: error.extensions,
        });
    }
};

export const userMutations = {
    changeUserRole,
};