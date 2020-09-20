const musicIdentifier = (state = "", action ) => {
    switch(action.type){
      case "ASSIGNMENT":
        return action.payload;
      default:
        return state;
    };
  };
  
  export default musicIdentifier;