import { combineReducers } from 'redux';
import musicIdentifier from './musicIdentifier';

const allReducers = combineReducers({
    musicIdentifier: musicIdentifier,
});

export default allReducers;