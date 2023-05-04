// logbookReducer

const addLog = (log) => ({
    type: 'ADD_LOG',
    payload: log,
});

const deleteLog = (id) => ({
    type: 'DELETE_LOG',
    payload: id,
});

// chatroomReducer

const joinChatroom = (users) => ({
    type: 'JOIN_CHATROOM',
    payload: users,
});

const sendMessage = (message) => ({
    type: 'SEND_MESSAGE',
    payload: message,
});

// export

const logActions = {
    addLog,
    deleteLog,
};

const chatroomActions = {
    joinChatroom,
    sendMessage,
};

export {
    logActions,
    chatroomActions,
};