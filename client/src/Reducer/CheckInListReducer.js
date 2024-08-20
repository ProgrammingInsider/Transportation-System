export const CheckInListReducer = (state, action) => {
    switch (action.type) {
        case "SUBMIT":
            return state.filter((list)=>{
                if((list.Id !== action.id) && list !== undefined){
                    return {...list}
                }
             });
               
        case "CANCEL":
            return state.filter((list)=>{
                if((list.Id !== action.id) && list !== undefined){
                    return {...list}
                }
             });

        case "ADD":
              return [
                ...state,
                action.payload
              ]
        
        case "FETCH":
            return [
                ...action.payload
            ]
                   
        default:
            return state;
    }
}