import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART,
  CLEAN_CART
} from "../../consts";
import assign from "lodash/assign";
import omit from "lodash/omit";
const initialState = {};

export const cartReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_TO_CART: {
      const { id } = payload;
      if (state[id]) {
        const updatedCart = assign({}, state, {
          [id]: {
            ...state[id],
            quantity: state[id].quantity + 1,
          },
        });
        return updatedCart;
      }
      return assign({}, state, {
        [id]: {
            ...payload,
          quantity: 1,
        },
      });
    }
    case UPDATE_CART:{
        const {id, quantity, type} = payload;
        if(type === 'remove'){
            const newQuantity = quantity -1;
            if(newQuantity === 0){
                return omit(state, [id])
            };
            return assign({}, state, {
              [id]: {
                ...state[id],
                quantity: quantity - 1,
              },
            });
        }
        return assign({}, state, {
          [id]: {
            ...state[id],
            quantity: quantity + 1,
          },
        });
    }
    case REMOVE_FROM_CART: return omit(state, [payload]) 
    case CLEAN_CART: return initialState
    default:
      return { ...state };
  }
};
