const usersReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_USERS": {
      return {
        ...state,
        isFetching: action.isFetching,
        list: action.payload || [],
      };
    }
    case "GET_USER": {
      return {
        ...state,
        isFetching: action.isFetching,
        profile: action.profileData,
      };
    }
    case "UPDATE_PROFILE": {
      return {
        ...state,
        profile: {
          ...state.profile,
          isPosting: action.isPosting,
        },
      };
    }
    case "REMOVE_PROFILE": {
      return {
        ...state,
        profile: null,
      };
    }
    default: {
      return state;
    }
  }
};

export default usersReducer;
