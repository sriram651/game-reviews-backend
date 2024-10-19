export const authTypes = `#graphql
    type ServerPong {
        success: Boolean!
        message: String!
    }

    input NewUserInput {
        userName: String!
        email: String!
        password: String!
        role: Role
    }

    input UserLoginInput {
        email: String!
        password: String!
    }
`;

export const authQueries = `#graphql
    pingServer: ServerPong!
`;

export const authMutations = `#graphql
    registerNewUser(newUser: NewUserInput!): UserResponse
    loginUser(userLogin: UserLoginInput!): UserResponse
`;