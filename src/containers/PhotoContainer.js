import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { getPhoto } from '../modules/photo';
import Photo from '../components/Photo';
import { withPreload } from '../lib/PreloadContext';

const PhotoContainer = ({ loading, data, getPhoto, id, ignore }) => {
  // 컴포넌트가 마운트 될 때 호출함
  useEffect(() => {
    if (ignore) return; // SSR 을 해서 무시해야 하는 상황이면 무시
    getPhoto(id);
  }, [id]);
  return <Photo loading={loading} photo={data} />;
};

export default compose(
  connect(
    state => ({
      loading: state.photo.loading,
      data: state.photo.data,
      ignore: state.ignore
    }),
    {
      getPhoto
    }
  ),
  // withPreload 에서는
  withPreload(({ props }) => props.getPhoto(props.id))
)(PhotoContainer);
