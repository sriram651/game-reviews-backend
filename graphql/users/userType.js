export const userType = `#graphql
    type User {
        id: ID!
        userName: String!
        email: String!
        createdAt: String!
        role: String!
    }
    type UserResponse {
        id: ID!
        userName: String!
        email: String!
        createdAt: String!
        role: String!
        token: String!
    }

    enum Role {
        ADMIN
        USER
        # SUPER_ADMIN
    }

    input NewUserInput {
        userName: String!
        email: String!
        password: String!
        role: Role
    }
`;

export const userMutations = `#graphql
    changeUserRole(email: String!, role: Role!): User
`;