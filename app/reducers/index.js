import { AUTHORIZE, SAFEAPP, CHECKACCESS } from '../actions'
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

    default: {
      console.log("NO ACTIONS matched");
    }
  }
  return state;
};

export default auth;
