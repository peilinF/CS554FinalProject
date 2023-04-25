const { gql } = require('apollo-server-express');
const { getUserById } = require('./data/user');

const typeDefs = gql`

    type User {
        _id: ID!
        name: String
        username: String
        avatar: String
    }

    type Query {
        getUserInfo(userId: ID!): User
    }

`;

const resolvers = {
    Query: {
        getUserInfo: async (_, { userId }) => {
            return await getUserById(userId);
        },
    },
};

module.exports = { typeDefs, resolvers };