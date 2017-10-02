import safe from '../safenetwork';

export const AUTH_REQUEST_SENT = 'AUTH_REQUEST_SENT';
export const AUTHORIZE = "AUTHORIZE";
export const SAFEAPP = "SAFEAPP";
export const CHECKACCESS = "CHECKACCESS";
export const ON_AUTH_SUCCESS = 'ON_AUTH_SUCCESS';
export const ON_AUTH_FAILURE = 'ON_AUTH_FAILURE';
export const SAVE_USER_INFO = 'SAVE_USER_INFO';
export const PROFILE_SAVED = 'PROFILE_SAVED';
export const FETCH_USER_PROFILE = 'FETCH_USER_PROFILE';

export const authorizationRequest = (props) => {
  console.log("Request to action: sendAuthRequest, return type AUTHORIZE");
  return (dispatch) => {
    return dispatch({
      type: AUTHORIZE,
      payload: safe.authorize(props)
    });
  };
};

export const checkAccessContainer = () => {
  console.log("Request to action: checkAccessContainer => CHECKACCESS");

  return (dispatch) => {
    return dispatch({
      type: CHECKACCESS,
      payload: safe.checkAccessContainer()
    })
  }
};

export const saveSafeApp = (app) => {
  return (dispatch) => {
    return dispatch({
      type: SAFEAPP,
      payload: safe.saveUri(app)
    });
  };
};

export const saveUserInfo = (props, user) => {
  return (dispatch) => {
    return dispatch({
      type: SAVE_USER_INFO,
      payload: safe.saveUserInfo(props, user)
    });
  };
};

export const profileSaved = (user) => {
  return (dispatch) => {
    return dispatch({
      type: PROFILE_SAVED,
      payload: user
    });
  };
};

export const fetchUserProfile = (props) => {
  return (dispatch) => {
    return dispatch({
      type: FETCH_USER_PROFILE,
      payload: safe.fetchUserProfile(props)
    });
  };
}
// export const sendAuthRequest = () => {
//   const action = AUTH_REQUEST_SENT;
//   return {
//     type: action
//   };
// };

// export const onAuthSuccess = (authInfo) => {
//   return {
//     type: ACTION_TYPES.ON_AUTH_SUCCESS
//   };
// };

// export const onAuthFailure = (error) => {
//   return {
//     type: ACTION_TYPES.ON_AUTH_FAILURE,
//     payload: error
//   };
// };
