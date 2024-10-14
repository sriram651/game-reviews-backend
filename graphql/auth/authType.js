export const authTypes = `#graphql
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

export const authMutations = `#graphql
    registerNewUser(newUser: NewUserInput!): UserResponse
    loginUser(userLogin: UserLoginInput!): UserResponse
`;