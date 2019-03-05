import React from 'react';
import { Link } from 'react-router-dom';
const Photo = ({ loading, photo }) => {
  if (loading) return <div>로딩중..</div>;
  if (!photo) return null;
  return (
    <div>
      <img src={photo.thumbnailUrl} alt="thumbnail" />
      <h1>{photo.title}</h1>
      <Link to={`/photo/${photo.id + 1}`}>다음</Link>
    </div>
  );
};

export default Photo;
