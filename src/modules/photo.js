import axios from 'axios';

const GET_PHOTO_PENDING = 'photo/GET_PHOTO_PENDING';
const GET_PHOTO_SUCCESS = 'photo/GET_PHOTO_SUCCESS';
const GET_PHOTO_FAILURE = 'photo/GET_PHOTO_FAILURE';

const getPhotoPending = () => ({
  type: GET_PHOTO_PENDING
});

const getPhotoSuccess = payload => ({
  type: GET_PHOTO_SUCCESS,
  payload
});

const getPhotoFailure = payload => ({
  type: GET_PHOTO_PENDING,
  payload,
  error: true
});

export const getPhoto = id => async dispatch => {
  try {
    dispatch(getPhotoPending());
    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/photos/' + id
    );
    dispatch(getPhotoSuccess(response));
  } catch (e) {
    dispatch(getPhotoFailure(e));
    throw e;
  }
};

const initialState = {
  data: null, // { albumId, id, title, url, thumbnailurl }
  error: null,
  loading: false
};

function photo(state = initialState, action) {
  switch (action.type) {
    case GET_PHOTO_PENDING:
      return {
        ...state,
        loading: true
      };
    case GET_PHOTO_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.data
      };
    case GET_PHOTO_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
}

export default photo;
