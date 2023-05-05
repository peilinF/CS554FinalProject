import { gql } from "@apollo/client";

const GET_USER_INFO = gql`
  query GetUserInfo($userId: ID!) {
    getUserInfo(userId: $userId) {
      _id
      name
      email
      avatar
      lastPosition {
        lat
        lng
      }
    }
  }
`;

const GET_USERS_INFO = gql`
  query GetUsersInfo($usersId: [ID!]!) {
    getUsersInfo(usersId: $usersId) {
      _id
      name
      email
      avatar
      lastPosition {
        lat
        lng
      }
    }
  }
`;

const ADD_FRIEND = gql`
  mutation AddFriend($userId: ID!, $friendId: ID!) {
    addFriend(userId: $userId, friendId: $friendId) {
      _id
      name
      email
      avatar
      friends {
        _id
        name
        email
        avatar
        lastPosition {
          lat
          lng
        }
      }
      lastPosition {
        lat
        lng
      }
    }
  }
`;

const GET_FRIENDS_LIST = gql`
  query GetFriendsList($userId: ID!) {
    getFriendsList(userId: $userId) {
      _id
      name
      email
      avatar
      lastPosition {
        lat
        lng
      }
    }
  }
`;

const GET_USER_POSITION = gql`
  query GetUserPosition($userId: ID!) {
    getUserPosition(userId: $userId) {
      lat
      lng
    }
  }
`;

const UPDATE_USER_POSITION = gql`
  mutation UpdateUserPosition($userId: ID!, $position: PositionInput!) {
    updateUserPosition(userId: $userId, position: $position) {
      _id
      name
      email
      avatar
      lastPosition {
        lat
        lng
      }
    }
  }
`;

const GET_LOGBOOK = gql`
  query GetLogbook($userId: ID!) {
    getLogbook(userId: $userId) {
      _id
      date
      time
      distance
      pace
      route {
        lat
        lng
      }
      notes
    }
  }
`;

const EDIT_LOG = gql`
  mutation EditLog($userId: ID!, $logId: ID!, $log: LogInput!) {
    editLog(userId: $userId, logId: $logId, log: $log) {
      _id
      date
      time
      distance
      pace
      route {
        lat
        lng
      }
      notes
    }
  }
`;

const DELETE_LOG = gql`
  mutation DeleteLog($userId: ID!, $logId: ID!) {
    deleteLog(userId: $userId, logId: $logId) {
      logId
      deleted
    }
  }
`;

const export_obj = {
  GET_USER_INFO,
  GET_USERS_INFO,
  ADD_FRIEND,
  GET_FRIENDS_LIST,
  GET_USER_POSITION,
  UPDATE_USER_POSITION,
  GET_LOGBOOK,
  EDIT_LOG,
  DELETE_LOG,
};

export default export_obj;
