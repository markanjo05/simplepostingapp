const postsReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_POSTS": {
      return {
        ...state,
        isPosting: action.isPosting,
        list: action.payload || [],
      };
    }
    case "GET_TOTAL_POSTS": {
      return {
        ...state,
        total: action.payload,
      };
    }
    case "GET_LAST_FETCHED": {
      return {
        ...state,
        lastFetched: action.lastFetched || null,
      };
    }
    case "CREATE_POST": {
      return {
        ...state,
        isPosting: action.payload,
        error: null,
      };
    }
    case "CREATE_POST_SUCCESS": {
      return {
        ...state,
        isPosting: action.payload,
        total: action.newTotal,
        error: null,
      };
    }
    case "CREATE_POST_ERR": {
      return {
        ...state,
        isPosting: false,
        error: action.err,
      };
    }
    case "UPDATE_POST": {
      return {
        ...state,
        isPosting: action.payload,
      };
    }
    case "UPDATE_POST_ERR": {
      return {
        ...state,
        isPosting: false,
        error: action.err,
      };
    }
    case "DELETE_POST": {
      return {
        ...state,
        isPosting: action.payload,
        total: action.newTotal,
      };
    }
    case "DELETE_POST_ERR": {
      return {
        ...state,
        isPosting: false,
        error: action.err,
      };
    }
    case "GET_POST_LIKERS": {
      return {
        ...state,
        isPosting: action.isPosting,
        postLikers: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default postsReducer;
