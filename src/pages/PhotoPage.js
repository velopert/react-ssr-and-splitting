import React from 'react';
import PhotoContainer from '../containers/PhotoContainer';

const PhotoPage = ({ match }) => {
  return <PhotoContainer id={match.params.id} />;
};

export default PhotoPage;
