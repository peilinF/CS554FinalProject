const initialState = {
  logbook: [],
  selectedLog: null,
};

const logbookReducer = (state = initialState, action) => {
  const { type, payload } = action;

  // const log = (state, payload) => {
  //     console.log("state:", state);
  //     console.log("payload:", payload);
  // };

  // log(state, payload);

  switch (type) {
    case "ADD_LOG":
      if (state.logbook.length !== 0) {
        if (state.logbook.find((log) => log._id === payload._id)) {
          return {
            ...state,
            selectedLog: payload._id,
          };
        }
      }

      return {
        logbook: [...state.logbook, { ...payload }],
        selectedLog: payload._id,
      };
    case "DELETE_LOG":
      return {
        logbook: state.logbook.filter((log) => log._id !== payload),
        selectedLog: null,
      };
    default:
      return state;
  }
};

export default logbookReducer;
