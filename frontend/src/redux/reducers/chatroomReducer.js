import { v4 as uuid } from "uuid";
import arraysAreEqual from "./utils";

import { useQuery, useMutation } from "@apollo/client";
import queries from "../../graphql/queries";

const initialState = {
  chatrooms: [],
  selectedChatroom: null,
};

const chatroomReducer = (state = initialState, action) => {
  const { type, payload } = action;

  const log = (state, payload) => {
    console.log("state:", state);
    console.log("payload:", payload);
  };

  log(state, payload);

  switch (type) {
    case "JOIN_CHATROOM":
      // chatroom = {
      //     id: uuid(),
      //     users: [],
      //     messages: [],
      // }

      if (state.chatrooms.length !== 0) {
        let chatroom = state.chatrooms.find((chatroom) => {
          return chatroom.users.id === payload.id;
        });

        // console.log("chatroom: ", chatroom);

        if (chatroom) {
          return {
            ...state,
            selectedChatroom: chatroom.id,
          };
        }
      }

      let id = uuid();
      const user = {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        //picture: payload.picture,   no pictrue for our database
      };
      return {
        chatrooms: [
          ...state.chatrooms,
          {
            id: id,
            users: user,
            messages: [],
          },
        ],
        selectedChatroom: id,
      };
    case "SEND_MESSAGE":
      return {
        ...state,
        chatrooms: state.chatrooms.map((chatroom) => {
          if (chatroom.id === state.selectedChatroom) {
            return {
              ...chatroom,
              messages: [...chatroom.messages, payload],
            };
          }
          return chatroom;
        }),
      };
    default:
      return state;
  }
};

export default chatroomReducer;
