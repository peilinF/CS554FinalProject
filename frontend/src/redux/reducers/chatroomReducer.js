import utils from './utils';

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

    // log(state, payload);

    switch (type) {
        case 'JOIN_CHATROOM':
            
            // chatroom = {
            //     id: hash id create from users id array,
            //     users: [],
            //     messages: [],
            // }

            if (state.chatrooms.length !== 0) {
                let chatroom = state.chatrooms.find((chatroom) => {
                    return utils.arraysAreEqual(chatroom.users, payload);
                });

                // console.log("chatroom: ", chatroom);

                if (chatroom) {
                    return {
                        ...state,
                        selectedChatroom: chatroom,
                    };
                }
            }

            let id = utils.createRoomId(payload);
            let new_chatroom = {
                id: id,
                users: payload,
                messages: [],
            };

            return {
                chatrooms: [...state.chatrooms, new_chatroom],
                selectedChatroom: new_chatroom,
            };
        case 'SEND_MESSAGE':
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