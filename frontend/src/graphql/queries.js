import { gql } from '@apollo/client';

const GET_USER_INFO = gql`
  query GetUserInfo($userId: ID!) {
    getUserInfo(userId: $userId) {
      _id
      name
      username
      avatar
    }
  }
`;

const export_obj = {
    GET_USER_INFO
};

export default export_obj;