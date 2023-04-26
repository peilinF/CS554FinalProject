const { gql } = require('apollo-server-express');
const userData = require('./data/user');

const typeDefs = gql`

    type User {
        _id: ID!
        name: String
        username: String
        avatar: String
        friends: [User]
        lastPosition: Position
    }

    type Position {
        lat: Float
        lng: Float
    }

    input PositionInput {
        lat: Float
        lng: Float
    }

    type Query {
        getUserInfo(userId: ID!): User
        getFriendsList(userId: ID!): [User]
        getUserPosition(userId: ID!): Position
    }

    type Mutation {
        addFriend(userId: ID!, friendId: ID!): User
        updateUserPosition(userId: ID!, position: PositionInput!): User
    }

`;

const resolvers = {
    Query: {
        getUserInfo: async (_, { userId }) => {
            return await userData.getUserById(userId);
        },

        getFriendsList: async (_, { userId }) => {
            return await userData.getFriendsList(userId);
        },

        getUserPosition: async (_, { userId }) => {
            return await userData.getUserPosition(userId);
        }
    },

    Mutation: {
        addFriend: async (_, { userId, friendId }) => {
            return await userData.addFriend(userId, friendId);
        },

        updateUserPosition: async (_, { userId, position }) => {
            return await userData.updateUserPosition(userId, position);
        }
    },
};

module.exports = { typeDefs, resolvers };