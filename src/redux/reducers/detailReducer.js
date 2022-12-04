const INITIAL_STATE = {
  detail: []
}

const detailReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'DETAIL':
      return {
        ...state,
        detail: [...state.detail, action.payload]

      }
    default:
      return state;
  }
};

export default detailReducer;