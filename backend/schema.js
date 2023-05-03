import { gql } from 'apollo-server-express';

import userData from './data/users.js';
import logbookData from './data/logbook.js';

const typeDefs = gql`

    type User {
        _id: ID!
        name: String
        email: String
        avatar: String
        friends: [User]
        lastPosition: Position
    }

    type Position {
        lat: Float
        lng: Float
    }

    type Log {
        _id: ID!
        date: String
        time: String
        distance: Float
        pace: String
        route: [Position]
        notes: String
    }

    type DeleteInfo {
        logId: ID!
        deleted: Boolean!
    }

    input PositionInput {
        lat: Float
        lng: Float
    }

    input LogInput {
        date: String
        time: String
        notes: String
    }

    type Query {
        getUserInfo(userId: ID!): User
        getFriendsList(userId: ID!): [User]
        getUserPosition(userId: ID!): Position
        getLogbook(userId: ID!): [Log]
    }

    type Mutation {
        addFriend(userId: ID!, friendId: ID!): User
        updateUserPosition(userId: ID!, position: PositionInput!): User
        editLog(userId: ID!, logId: ID!, log: LogInput!): Log
        deleteLog(userId: ID!, logId: ID!): DeleteInfo
    }

`;

const resolvers = {
    Query: {
        getUserInfo: async (_, { userId }) => {
            return await userData.getUserById(userId);
        },

        getFriendsList: async (_, { userId }) => {
            let res = await userData.getFriendsList(userId);
            return res;
        },

        getUserPosition: async (_, { userId }) => {
            return await userData.getUserPosition(userId);
        },

        getLogbook: async (_, { userId }) => {
            return await logbookData.getAllLogs(userId);
        }
    },

    Mutation: {
        addFriend: async (_, { userId, friendId }) => {
            return await userData.addFriend(userId, friendId);
        },

        updateUserPosition: async (_, { userId, position }) => {
            return await userData.updateUserPosition(userId, position);
        },

        editLog: async (_, { userId, logId, log }) => {
            console.log('editLog resolver');
            return await logbookData.updateLog(userId, logId, log);
        },

        deleteLog: async (_, { userId, logId }) => {
            return await logbookData.deleteLog(userId, logId);
        }
    },
};

export { typeDefs, resolvers };
