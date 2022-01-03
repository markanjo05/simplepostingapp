const authReducer = (state = {}, action) => {
  switch (action.type) {
    case "LOG_IN": {
      return {
        ...state,
        authError: null,
        isPosting: action.isPosting || true,
      };
    }
    case "LOGIN_SUCCESS": {
      return {
        ...state,
        loggedUser: action.payload,
        authError: null,
        isPosting: action.isPosting || false,
      };
    }
    case "LOGIN_ERROR": {
      return {
        ...state,
        authError: action.err.message,
        isPosting: action.isPosting || false,
        loggedUser: undefined,
      };
    }
    case "LOGOUT_SUCCESS": {
      return {
        ...state,
        loggedUser: null,
        authError: null,
        isPosting: false,
      };
    }
    case "SIGN_UP": {
      return {
        ...state,
        authError: null,
        isPosting: action.isPosting || true,
      };
    }
    case "SIGNUP_SUCCESS": {
      return {
        ...state,
        loggedUser: action.payload,
        authError: null,
        isPosting: action.isPosting || false,
      };
    }
    case "SIGNUP_ERROR": {
      return {
        ...state,
        authError: action.err.message,
        isPosting: action.isPosting || false,
      };
    }
    case "FETCH_LOGGED_USER_DATA": {
      return {
        ...state,
        loggedUser: action.payload,
      };
    }
    case "RESET_AUTH_SUCCESS": {
      return {
        ...state,
        authError: null,
        isPosting: false,
      };
    }
    default: {
      return state;
    }
  }
};

export default authReducer;
