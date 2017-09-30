import { AUTHORIZE, SAFEAPP, CHECKACCESS, SAVE_USER_INFO } from '../actions'
import safe from '../safenetwork'

const auth = (state, action) => {
  switch(action.type) {
    case AUTHORIZE: {
      state = {
        ...state
      }
      break;
    }

    case SAFEAPP: {
      state = {
        ...state,
        app : action.payload
      }
      break;
    }

    case CHECKACCESS: {
      state = {
        ...state
      }
      break;
    }

    case SAVE_USER_INFO: {
      state = {
        ...state
      }
      break;
    }

    default: {
      console.log("NO ACTIONS matched");
    }
  }
  return state;
};

export default auth;
