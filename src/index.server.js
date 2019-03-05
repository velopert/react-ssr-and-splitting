import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import path from 'path';
import { StaticRouter } from 'react-router';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import App from './App';
import PreloadContext from './lib/PreloadContext';
import rootReducer from './modules';
import { applyIgnore } from './modules/ignore';

const statsFile = path.resolve('./build/loadable-stats.json');

const app = express();

// 서버사이드 렌더링된 결과에 따라 html 을 조합해서 보여줍니다.
function createPage(root, tags) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="shortcut icon" href="/favicon.ico" />
  <meta
    name="viewport"
    content="width=device-width,initial-scale=1,shrink-to-fit=no"
  />
  <meta name="theme-color" content="#000000" />
  <title>React App</title>
  ${tags.styles}
  ${tags.links}
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root">
    ${root}
    ${tags.scripts}
  </div>
</body>
</html>
  `;
}

// 서버사이드 렌더링을 처리 할 핸들러 함수입니다.
const serverRender = async (req, res, next) => {
  // 이 함수는 404가 떠야 하는 상황에 404를 띄우지 않고 서버사이드 렌더링을 해줍니다.
  if (req.route) return next();

  // 필요한 파일 추출하기 위한 사전 작업
  const extractor = new ChunkExtractor({ statsFile });
  const context = {};

  const store = createStore(rootReducer, applyMiddleware(thunk));

  const preloads = []; // 수집된 콜백함수들을 이 배열에 추가합니다.
  const jsx = (
    <PreloadContext.Provider value={preloads}>
      <Provider store={store}>
        <ChunkExtractorManager extractor={extractor}>
          <StaticRouter location={req.url} context={context}>
            <App />
          </StaticRouter>
        </ChunkExtractorManager>
      </Provider>
    </PreloadContext.Provider>
  );

  ReactDOMServer.renderToStaticMarkup(jsx); // renderToString 보다 적은 리소스를 사용합니다.

  // 콜백함수들을 호출하고, Promise 들이 모두 끝날 때 까지 대기합니다.
  const promises = preloads.map(preload =>
    preload.callback({ store, props: preload.props })
  );
  try {
    await Promise.all(promises);
    store.dispatch(applyIgnore());
  } catch (e) {}

  const root = ReactDOMServer.renderToString(jsx); // 렌더링을 하고
  // JSON 을 문자열로 변환하고 악성스크립트가 실행되는것을 방지하기 위해서 < 를 치환처리
  // https://redux.js.org/recipes/server-rendering#security-considerations
  const stateString = JSON.stringify(store.getState()).replace(/</g, '\\u003c');
  const stateScript = `<script>__PRELOADED_STATE__ = ${stateString}</script>`;
  const tags = {
    // 미리 불러와야 하는 스타일 / 스크립트를 추출하고
    scripts: stateScript + extractor.getScriptTags(),
    links: extractor.getLinkTags(),
    styles: extractor.getStyleTags()
  };
  res.send(createPage(root, tags)); // 결과물을 응답합니다.
};

app.use(
  express.static(path.resolve('./build'), {
    index: false // "/" 경로에서 index.html 을 보여주지 않고 서버사이드 렌더링을 합니다.
  })
);
app.use(serverRender);

// 5000 포트로 서버를 가동합니다.
app.listen(5000, () => {
  console.log('Running on http://localhost:5000');
});
