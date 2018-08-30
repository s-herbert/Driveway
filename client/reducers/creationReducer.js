import * as types from "../constants/actionTypes";

const initialState = {
  createDrivewayModal: false,
  submitError: false, 
  timeError: false,
  startTime: 'none',
  endTime: 'none',
};

const creationReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.OPEN_CREATE_MODAL:
      return {
        ...state,
        createDrivewayModal: true
      };
    case types.CLOSE_CREATE_MODAL:
      return {
        ...state,
        createDrivewayModal: false,
        submitError: false
      };
    case types.CREATE_DRIVEWAY:
      fetch("/createDriveway", {
        method: "POST",
        body: action.payload
      })
        .then(res => {
          console.log("POST status: ", res.status);
        })
        .catch(err => {
          console.log(err);
        });
      return {
        ...state,
        createDrivewayModal: false
      };
    case types.SET_CREATE_END:
      return {
        ...state,
        endTime: action.payload
      };
    case types.SET_CREATE_START:
      return {
        ...state,
        startTime: action.payload
      };
    case types.INCOMPLETE:
      return {
        ...state,
        submitError: true
      };

      case types.END_BEFORE_START:
      return{
        ...state,
        timeError: true
      }

    default:
      return state;
  }
};

export default creationReducer;
