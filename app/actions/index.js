import safe from '../safenetwork';

export const AUTH_REQUEST_SENT = 'AUTH_REQUEST_SENT';
export const AUTHORIZE = "AUTHORIZE";
export const SAFEAPP = "SAFEAPP";
export const CHECKACCESS = "CHECKACCESS";
export const ON_AUTH_SUCCESS = 'ON_AUTH_SUCCESS';
export const ON_AUTH_FAILURE = 'ON_AUTH_FAILURE';


export function authorizationRequest(state) {
  console.log("Request to action: sendAuthRequest, return type AUTHORIZE");
  // const action = {
  //   type: AUTHORIZE
  // }
  // return action;

  // return (dispatch) => {
  //   return dispatch({

  //   });
  // };

  return (dispatch) => {
      return dispatch({
        type: AUTHORIZE,
        payload: safe.authorize()
      });
  };
};

export const checkAccessContainer = () => {
  console.log("Request to action: checkAccessContainer => CHECKACCESS");

  return (dispatch) => {
    return dispatch({
      type : CHECKACCESS,
      payload: safe.checkAccessContainer()
    })
  }
}

export const saveSafeApp = (app) => {
  return {
    type: SAFEAPP,
    payload: app
  }
};



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
