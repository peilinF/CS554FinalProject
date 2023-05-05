const initialState = {
    userInfo: null,
};

const userInfoReducer = (state = initialState, action) => {

    const { type, payload } = action;

    // const log = (state, payload) => {
    //     console.log("state:", state);
    //     console.log("payload:", payload);
    // };

    // log(state, payload);

    switch (type) {
        case 'SET_USER_INFO':
            return {
                userInfo: payload,
            };
        default:
            return state;
    }
};

export default userInfoReducer;