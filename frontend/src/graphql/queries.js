import { gql } from '@apollo/client';

const GET_USER_INFO = gql`
  query GetUserInfo($userId: ID!) {
    getUserInfo(userId: $userId) {
      _id
      name
      username
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
            username
            avatar
            friends {
              username
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
            username
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
            username
            avatar
            lastPosition {
              lat
              lng
            }
        }
    }
`;

const export_obj = {
    GET_USER_INFO,
    ADD_FRIEND,
    GET_FRIENDS_LIST,
    GET_USER_POSITION,
    UPDATE_USER_POSITION
};

export default export_obj;