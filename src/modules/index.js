import { combineReducers } from 'redux';
import photo from './photo';
import ignore from './ignore';

const rootReducer = combineReducers({
  photo,
  ignore
});

export default rootReducer;
