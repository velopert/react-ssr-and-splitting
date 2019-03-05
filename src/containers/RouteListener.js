import { useEffect } from 'react';
import { connect } from 'react-redux';
import { resolveIgnore } from '../modules/ignore';
import { withRouter } from 'react-router-dom';

// 이 컴포넌트는 라우트가 변동 도리 때 resolveIgnore 를 호출하여
// API를 재요청해야 하는 상황에는 재요청을 할 수 있게 해줍니다.
const RouteListener = ({ history, resolveIgnore, ignore }) => {
  useEffect(() => {
    if (!ignore) return;
    const unlisten = history.listen(location => {
      resolveIgnore();
      unlisten();
    });
    return unlisten;
  }, []);
  return null;
};

export default connect(
  state => ({
    ignore: state.ignore
  }),
  { resolveIgnore }
)(withRouter(RouteListener));
