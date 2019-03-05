// SSR 이 이루어진 상태에서는 API 를 재요청을 하는것은 트래픽 낭비 + 나쁜 UX 를 제공합니다.
// 재요청을 해야할지 말아야할지 정하는 모듈입니다

const APPLY_IGNORE = 'ignore/APPLY_IGNORE';
const RESOLVE_IGNORE = 'ignore/RESOLVE_IGNORE';

export const applyIgnore = () => ({
  type: APPLY_IGNORE
});
export const resolveIgnore = () => ({
  type: RESOLVE_IGNORE
});

const initialState = false;

export default function ignore(state = initialState, action) {
  switch (action.type) {
    case APPLY_IGNORE:
      return true;
    case RESOLVE_IGNORE:
      return false;
    default:
      return state;
  }
}
