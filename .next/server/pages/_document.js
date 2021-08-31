"use strict";
(() => {
var exports = {};
exports.id = "pages/_document";
exports.ids = ["pages/_document"];
exports.modules = {

/***/ "./node_modules/next/dist/client/head-manager.js":
/*!*******************************************************!*\
  !*** ./node_modules/next/dist/client/head-manager.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = initHeadManager;
exports.DOMAttributeNames = void 0;
const DOMAttributeNames = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv',
  noModule: 'noModule'
};
exports.DOMAttributeNames = DOMAttributeNames;

function reactElementToDOM({
  type,
  props
}) {
  const el = document.createElement(type);

  for (const p in props) {
    if (!props.hasOwnProperty(p)) continue;
    if (p === 'children' || p === 'dangerouslySetInnerHTML') continue; // we don't render undefined props to the DOM

    if (props[p] === undefined) continue;
    const attr = DOMAttributeNames[p] || p.toLowerCase();

    if (type === 'script' && (attr === 'async' || attr === 'defer' || attr === 'noModule')) {
      el[attr] = !!props[p];
    } else {
      el.setAttribute(attr, props[p]);
    }
  }

  const {
    children,
    dangerouslySetInnerHTML
  } = props;

  if (dangerouslySetInnerHTML) {
    el.innerHTML = dangerouslySetInnerHTML.__html || '';
  } else if (children) {
    el.textContent = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
  }

  return el;
}

function updateElements(type, components) {
  const headEl = document.getElementsByTagName('head')[0];
  const headCountEl = headEl.querySelector('meta[name=next-head-count]');

  if (true) {
    if (!headCountEl) {
      console.error('Warning: next-head-count is missing. https://nextjs.org/docs/messages/next-head-count-missing');
      return;
    }
  }

  const headCount = Number(headCountEl.content);
  const oldTags = [];

  for (let i = 0, j = headCountEl.previousElementSibling; i < headCount; i++, j = j.previousElementSibling) {
    if (j.tagName.toLowerCase() === type) {
      oldTags.push(j);
    }
  }

  const newTags = components.map(reactElementToDOM).filter(newTag => {
    for (let k = 0, len = oldTags.length; k < len; k++) {
      const oldTag = oldTags[k];

      if (oldTag.isEqualNode(newTag)) {
        oldTags.splice(k, 1);
        return false;
      }
    }

    return true;
  });
  oldTags.forEach(t => t.parentNode.removeChild(t));
  newTags.forEach(t => headEl.insertBefore(t, headCountEl));
  headCountEl.content = (headCount - oldTags.length + newTags.length).toString();
}

function initHeadManager() {
  let updatePromise = null;
  return {
    mountedInstances: new Set(),
    updateHead: head => {
      const promise = updatePromise = Promise.resolve().then(() => {
        if (promise !== updatePromise) return;
        updatePromise = null;
        const tags = {};
        head.forEach(h => {
          if ( // If the font tag is loaded only on client navigation
          // it won't be inlined. In this case revert to the original behavior
          h.type === 'link' && h.props['data-optimized-fonts'] && !document.querySelector(`style[data-href="${h.props['data-href']}"]`)) {
            h.props.href = h.props['data-href'];
            h.props['data-href'] = undefined;
          }

          const components = tags[h.type] || [];
          components.push(h);
          tags[h.type] = components;
        });
        const titleComponent = tags.title ? tags.title[0] : null;
        let title = '';

        if (titleComponent) {
          const {
            children
          } = titleComponent.props;
          title = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
        }

        if (title !== document.title) document.title = title;
        ['meta', 'base', 'link', 'style', 'script'].forEach(type => {
          updateElements(type, tags[type] || []);
        });
      });
    }
  };
}

/***/ }),

/***/ "./node_modules/next/dist/client/request-idle-callback.js":
/*!****************************************************************!*\
  !*** ./node_modules/next/dist/client/request-idle-callback.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.requestIdleCallback = exports.cancelIdleCallback = void 0;

const requestIdleCallback = typeof self !== 'undefined' && self.requestIdleCallback && self.requestIdleCallback.bind(window) || function (cb) {
  let start = Date.now();
  return setTimeout(function () {
    cb({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
};

exports.requestIdleCallback = requestIdleCallback;

const cancelIdleCallback = typeof self !== 'undefined' && self.cancelIdleCallback && self.cancelIdleCallback.bind(window) || function (id) {
  return clearTimeout(id);
};

exports.cancelIdleCallback = cancelIdleCallback;

/***/ }),

/***/ "./node_modules/next/dist/client/script.js":
/*!*************************************************!*\
  !*** ./node_modules/next/dist/client/script.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.initScriptLoader = initScriptLoader;
exports.default = void 0;

var _react = __webpack_require__(/*! react */ "react");

var _headManagerContext = __webpack_require__(/*! ../shared/lib/head-manager-context */ "../shared/lib/head-manager-context");

var _headManager = __webpack_require__(/*! ./head-manager */ "./node_modules/next/dist/client/head-manager.js");

var _requestIdleCallback = __webpack_require__(/*! ./request-idle-callback */ "./node_modules/next/dist/client/request-idle-callback.js");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === "function") {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

const ScriptCache = new Map();
const LoadCache = new Set();
const ignoreProps = ['onLoad', 'dangerouslySetInnerHTML', 'children', 'onError', 'strategy'];

const loadScript = props => {
  const {
    src,
    id,
    onLoad = () => {},
    dangerouslySetInnerHTML,
    children = '',
    onError
  } = props;
  const cacheKey = id || src; // Script has already loaded

  if (cacheKey && LoadCache.has(cacheKey)) {
    return;
  } // Contents of this script are already loading/loaded


  if (ScriptCache.has(src)) {
    LoadCache.add(cacheKey); // Execute onLoad since the script loading has begun

    ScriptCache.get(src).then(onLoad, onError);
    return;
  }

  const el = document.createElement('script');
  const loadPromise = new Promise((resolve, reject) => {
    el.addEventListener('load', function (e) {
      resolve();

      if (onLoad) {
        onLoad.call(this, e);
      }
    });
    el.addEventListener('error', function (e) {
      reject(e);
    });
  }).catch(function (e) {
    if (onError) {
      onError(e);
    }
  });

  if (src) {
    ScriptCache.set(src, loadPromise);
  }

  LoadCache.add(cacheKey);

  if (dangerouslySetInnerHTML) {
    el.innerHTML = dangerouslySetInnerHTML.__html || '';
  } else if (children) {
    el.textContent = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
  } else if (src) {
    el.src = src;
  }

  for (const [k, value] of Object.entries(props)) {
    if (value === undefined || ignoreProps.includes(k)) {
      continue;
    }

    const attr = _headManager.DOMAttributeNames[k] || k.toLowerCase();
    el.setAttribute(attr, value);
  }

  document.body.appendChild(el);
};

function handleClientScriptLoad(props) {
  const {
    strategy = 'afterInteractive'
  } = props;

  if (strategy === 'afterInteractive') {
    loadScript(props);
  } else if (strategy === 'lazyOnload') {
    window.addEventListener('load', () => {
      (0, _requestIdleCallback).requestIdleCallback(() => loadScript(props));
    });
  }
}

function loadLazyScript(props) {
  if (document.readyState === 'complete') {
    (0, _requestIdleCallback).requestIdleCallback(() => loadScript(props));
  } else {
    window.addEventListener('load', () => {
      (0, _requestIdleCallback).requestIdleCallback(() => loadScript(props));
    });
  }
}

function initScriptLoader(scriptLoaderItems) {
  scriptLoaderItems.forEach(handleClientScriptLoad);
}

function Script(props) {
  const {
    src = '',
    onLoad = () => {},
    dangerouslySetInnerHTML,
    strategy = 'afterInteractive',
    onError
  } = props,
        restProps = _objectWithoutProperties(props, ["src", "onLoad", "dangerouslySetInnerHTML", "strategy", "onError"]); // Context is available only during SSR


  const {
    updateScripts,
    scripts
  } = (0, _react).useContext(_headManagerContext.HeadManagerContext);
  (0, _react).useEffect(() => {
    if (strategy === 'afterInteractive') {
      loadScript(props);
    } else if (strategy === 'lazyOnload') {
      loadLazyScript(props);
    }
  }, [props, strategy]);

  if (strategy === 'beforeInteractive') {
    if (updateScripts) {
      scripts.beforeInteractive = (scripts.beforeInteractive || []).concat([_objectSpread({
        src,
        onLoad,
        onError
      }, restProps)]);
      updateScripts(scripts);
    } else {
      loadScript(props);
    }
  }

  return null;
}

var _default = Script;
exports.default = _default;

/***/ }),

/***/ "./node_modules/next/dist/pages/_document.js":
/*!***************************************************!*\
  !*** ./node_modules/next/dist/pages/_document.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "DocumentContext", ({
  enumerable: true,
  get: function () {
    return _utils.DocumentContext;
  }
}));
Object.defineProperty(exports, "DocumentInitialProps", ({
  enumerable: true,
  get: function () {
    return _utils.DocumentInitialProps;
  }
}));
Object.defineProperty(exports, "DocumentProps", ({
  enumerable: true,
  get: function () {
    return _utils.DocumentProps;
  }
}));
exports.Html = Html;
exports.Main = Main;
exports.default = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));

var _server = _interopRequireDefault(__webpack_require__(/*! styled-jsx/server */ "styled-jsx/server"));

var _constants = __webpack_require__(/*! ../shared/lib/constants */ "../shared/lib/constants");

var _documentContext = __webpack_require__(/*! ../shared/lib/document-context */ "../shared/lib/document-context");

var _utils = __webpack_require__(/*! ../shared/lib/utils */ "../shared/lib/utils");

var _getPageFiles = __webpack_require__(/*! ../server/get-page-files */ "../server/get-page-files");

var _utils1 = __webpack_require__(/*! ../server/utils */ "../server/utils");

var _htmlescape = __webpack_require__(/*! ../server/htmlescape */ "../server/htmlescape");

var _script = _interopRequireDefault(__webpack_require__(/*! ../client/script */ "./node_modules/next/dist/client/script.js"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};

          if (desc.get || desc.set) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
    }

    newObj.default = obj;
    return newObj;
  }
}

function getDocumentFiles(buildManifest, pathname, inAmpMode) {
  const sharedFiles = (0, _getPageFiles).getPageFiles(buildManifest, '/_app');
  const pageFiles = inAmpMode ? [] : (0, _getPageFiles).getPageFiles(buildManifest, pathname);
  return {
    sharedFiles,
    pageFiles,
    allFiles: [...new Set([...sharedFiles, ...pageFiles])]
  };
}

function getPolyfillScripts(context, props) {
  // polyfills.js has to be rendered as nomodule without async
  // It also has to be the first script to load
  const {
    assetPrefix,
    buildManifest,
    devOnlyCacheBusterQueryString,
    disableOptimizedLoading
  } = context;
  return buildManifest.polyfillFiles.filter(polyfill => polyfill.endsWith('.js') && !polyfill.endsWith('.module.js')).map(polyfill => /*#__PURE__*/_react.default.createElement("script", {
    key: polyfill,
    defer: !disableOptimizedLoading,
    nonce: props.nonce,
    crossOrigin: props.crossOrigin || undefined,
    noModule: true,
    src: `${assetPrefix}/_next/${polyfill}${devOnlyCacheBusterQueryString}`
  }));
}

function getPreNextScripts(context, props) {
  const {
    scriptLoader,
    disableOptimizedLoading
  } = context;
  return (scriptLoader.beforeInteractive || []).map((file, index) => {
    const {
      strategy
    } = file,
          scriptProps = _objectWithoutProperties(file, ["strategy"]);

    return /*#__PURE__*/_react.default.createElement("script", Object.assign({}, scriptProps, {
      key: scriptProps.src || index,
      defer: !disableOptimizedLoading,
      nonce: props.nonce,
      crossOrigin: props.crossOrigin || undefined
    }));
  });
}

function getDynamicChunks(context, props, files) {
  const {
    dynamicImports,
    assetPrefix,
    isDevelopment,
    devOnlyCacheBusterQueryString,
    disableOptimizedLoading
  } = context;
  return dynamicImports.map(file => {
    if (!file.endsWith('.js') || files.allFiles.includes(file)) return null;
    return /*#__PURE__*/_react.default.createElement("script", {
      async: !isDevelopment && disableOptimizedLoading,
      defer: !disableOptimizedLoading,
      key: file,
      src: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
      nonce: props.nonce,
      crossOrigin: props.crossOrigin || undefined
    });
  });
}

function getScripts(context, props, files) {
  var ref;
  const {
    assetPrefix,
    buildManifest,
    isDevelopment,
    devOnlyCacheBusterQueryString,
    disableOptimizedLoading
  } = context;
  const normalScripts = files.allFiles.filter(file => file.endsWith('.js'));
  const lowPriorityScripts = (ref = buildManifest.lowPriorityFiles) === null || ref === void 0 ? void 0 : ref.filter(file => file.endsWith('.js'));
  return [...normalScripts, ...lowPriorityScripts].map(file => {
    return /*#__PURE__*/_react.default.createElement("script", {
      key: file,
      src: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
      nonce: props.nonce,
      async: !isDevelopment && disableOptimizedLoading,
      defer: !disableOptimizedLoading,
      crossOrigin: props.crossOrigin || undefined
    });
  });
}

class Document1 extends _react.Component {
  /**
  * `getInitialProps` hook returns the context object with the addition of `renderPage`.
  * `renderPage` callback executes `React` rendering logic synchronously to support server-rendering wrappers
  */
  static async getInitialProps(ctx) {
    const enhanceApp = App => {
      return props => /*#__PURE__*/_react.default.createElement(App, Object.assign({}, props));
    };

    const {
      html,
      head
    } = await ctx.renderPage({
      enhanceApp
    });
    const styles = [...(0, _server).default()];
    return {
      html,
      head,
      styles
    };
  }

  static renderDocument(DocumentComponent, props) {
    return /*#__PURE__*/_react.default.createElement(_documentContext.DocumentContext.Provider, {
      value: props
    }, /*#__PURE__*/_react.default.createElement(DocumentComponent, Object.assign({}, props)));
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(Html, null, /*#__PURE__*/_react.default.createElement(Head, null), /*#__PURE__*/_react.default.createElement("body", null, /*#__PURE__*/_react.default.createElement(Main, null), /*#__PURE__*/_react.default.createElement(NextScript, null)));
  }

}

exports.default = Document1;

function Html(props) {
  const {
    inAmpMode,
    docComponentsRendered,
    locale
  } = (0, _react).useContext(_documentContext.DocumentContext);
  docComponentsRendered.Html = true;
  return /*#__PURE__*/_react.default.createElement("html", Object.assign({}, props, {
    lang: props.lang || locale || undefined,
    amp: inAmpMode ? '' : undefined,
    "data-ampdevmode": inAmpMode && true ? '' : undefined
  }));
}

class Head extends _react.Component {
  getCssLinks(files) {
    const {
      assetPrefix,
      devOnlyCacheBusterQueryString,
      dynamicImports
    } = this.context;
    const cssFiles = files.allFiles.filter(f => f.endsWith('.css'));
    const sharedFiles = new Set(files.sharedFiles); // Unmanaged files are CSS files that will be handled directly by the
    // webpack runtime (`mini-css-extract-plugin`).

    let unmangedFiles = new Set([]);
    let dynamicCssFiles = Array.from(new Set(dynamicImports.filter(file => file.endsWith('.css'))));

    if (dynamicCssFiles.length) {
      const existing = new Set(cssFiles);
      dynamicCssFiles = dynamicCssFiles.filter(f => !(existing.has(f) || sharedFiles.has(f)));
      unmangedFiles = new Set(dynamicCssFiles);
      cssFiles.push(...dynamicCssFiles);
    }

    let cssLinkElements = [];
    cssFiles.forEach(file => {
      const isSharedFile = sharedFiles.has(file);

      if (true) {
        cssLinkElements.push( /*#__PURE__*/_react.default.createElement("link", {
          key: `${file}-preload`,
          nonce: this.props.nonce,
          rel: "preload",
          href: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
          as: "style",
          crossOrigin: this.props.crossOrigin || undefined
        }));
      }

      const isUnmanagedFile = unmangedFiles.has(file);
      cssLinkElements.push( /*#__PURE__*/_react.default.createElement("link", {
        key: file,
        nonce: this.props.nonce,
        rel: "stylesheet",
        href: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
        crossOrigin: this.props.crossOrigin || undefined,
        "data-n-g": isUnmanagedFile ? undefined : isSharedFile ? '' : undefined,
        "data-n-p": isUnmanagedFile ? undefined : isSharedFile ? undefined : ''
      }));
    });

    if (false) {}

    return cssLinkElements.length === 0 ? null : cssLinkElements;
  }

  getPreloadDynamicChunks() {
    const {
      dynamicImports,
      assetPrefix,
      devOnlyCacheBusterQueryString
    } = this.context;
    return dynamicImports.map(file => {
      if (!file.endsWith('.js')) {
        return null;
      }

      return /*#__PURE__*/_react.default.createElement("link", {
        rel: "preload",
        key: file,
        href: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
        as: "script",
        nonce: this.props.nonce,
        crossOrigin: this.props.crossOrigin || undefined
      });
    }) // Filter out nulled scripts
    .filter(Boolean);
  }

  getPreloadMainLinks(files) {
    const {
      assetPrefix,
      devOnlyCacheBusterQueryString,
      scriptLoader
    } = this.context;
    const preloadFiles = files.allFiles.filter(file => {
      return file.endsWith('.js');
    });
    return [...(scriptLoader.beforeInteractive || []).map(file => /*#__PURE__*/_react.default.createElement("link", {
      key: file.src,
      nonce: this.props.nonce,
      rel: "preload",
      href: file.src,
      as: "script",
      crossOrigin: this.props.crossOrigin || undefined
    })), ...preloadFiles.map(file => /*#__PURE__*/_react.default.createElement("link", {
      key: file,
      nonce: this.props.nonce,
      rel: "preload",
      href: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
      as: "script",
      crossOrigin: this.props.crossOrigin || undefined
    }))];
  }

  getDynamicChunks(files) {
    return getDynamicChunks(this.context, this.props, files);
  }

  getPreNextScripts() {
    return getPreNextScripts(this.context, this.props);
  }

  getScripts(files) {
    return getScripts(this.context, this.props, files);
  }

  getPolyfillScripts() {
    return getPolyfillScripts(this.context, this.props);
  }

  handleDocumentScriptLoaderItems(children) {
    const {
      scriptLoader
    } = this.context;
    const scriptLoaderItems = [];
    const filteredChildren = [];

    _react.default.Children.forEach(children, child => {
      if (child.type === _script.default) {
        if (child.props.strategy === 'beforeInteractive') {
          scriptLoader.beforeInteractive = (scriptLoader.beforeInteractive || []).concat([_objectSpread({}, child.props)]);
          return;
        } else if (['lazyOnload', 'afterInteractive'].includes(child.props.strategy)) {
          scriptLoaderItems.push(child.props);
          return;
        }
      }

      filteredChildren.push(child);
    });

    this.context.__NEXT_DATA__.scriptLoader = scriptLoaderItems;
    return filteredChildren;
  }

  makeStylesheetInert(node) {
    return _react.default.Children.map(node, c => {
      if (c.type === 'link' && c.props['href'] && _constants.OPTIMIZED_FONT_PROVIDERS.some(({
        url
      }) => c.props['href'].startsWith(url))) {
        const newProps = _objectSpread({}, c.props || {});

        newProps['data-href'] = newProps['href'];
        newProps['href'] = undefined;
        return /*#__PURE__*/_react.default.cloneElement(c, newProps);
      } else if (c.props && c.props['children']) {
        c.props['children'] = this.makeStylesheetInert(c.props['children']);
      }

      return c;
    });
  }

  render() {
    const {
      styles,
      ampPath,
      inAmpMode,
      hybridAmp,
      canonicalBase,
      __NEXT_DATA__,
      dangerousAsPath,
      headTags,
      unstable_runtimeJS,
      unstable_JsPreload,
      disableOptimizedLoading
    } = this.context;
    const disableRuntimeJS = unstable_runtimeJS === false;
    const disableJsPreload = unstable_JsPreload === false || !disableOptimizedLoading;
    this.context.docComponentsRendered.Head = true;
    let {
      head
    } = this.context;
    let cssPreloads = [];
    let otherHeadElements = [];

    if (head) {
      head.forEach(c => {
        if (c && c.type === 'link' && c.props['rel'] === 'preload' && c.props['as'] === 'style') {
          cssPreloads.push(c);
        } else {
          c && otherHeadElements.push(c);
        }
      });
      head = cssPreloads.concat(otherHeadElements);
    }

    let children = _react.default.Children.toArray(this.props.children).filter(Boolean); // show a warning if Head contains <title> (only in development)


    if (true) {
      children = _react.default.Children.map(children, child => {
        var ref;
        const isReactHelmet = child === null || child === void 0 ? void 0 : (ref = child.props) === null || ref === void 0 ? void 0 : ref['data-react-helmet'];

        if (!isReactHelmet) {
          var ref1;

          if ((child === null || child === void 0 ? void 0 : child.type) === 'title') {
            console.warn("Warning: <title> should not be used in _document.js's <Head>. https://nextjs.org/docs/messages/no-document-title");
          } else if ((child === null || child === void 0 ? void 0 : child.type) === 'meta' && (child === null || child === void 0 ? void 0 : (ref1 = child.props) === null || ref1 === void 0 ? void 0 : ref1.name) === 'viewport') {
            console.warn("Warning: viewport meta tags should not be used in _document.js's <Head>. https://nextjs.org/docs/messages/no-document-viewport-meta");
          }
        }

        return child;
      });
      if (this.props.crossOrigin) console.warn('Warning: `Head` attribute `crossOrigin` is deprecated. https://nextjs.org/docs/messages/doc-crossorigin-deprecated');
    }

    if (false) {}

    children = this.handleDocumentScriptLoaderItems(children);
    let hasAmphtmlRel = false;
    let hasCanonicalRel = false; // show warning and remove conflicting amp head tags

    head = _react.default.Children.map(head || [], child => {
      if (!child) return child;
      const {
        type,
        props
      } = child;

      if (inAmpMode) {
        let badProp = '';

        if (type === 'meta' && props.name === 'viewport') {
          badProp = 'name="viewport"';
        } else if (type === 'link' && props.rel === 'canonical') {
          hasCanonicalRel = true;
        } else if (type === 'script') {
          // only block if
          // 1. it has a src and isn't pointing to ampproject's CDN
          // 2. it is using dangerouslySetInnerHTML without a type or
          // a type of text/javascript
          if (props.src && props.src.indexOf('ampproject') < -1 || props.dangerouslySetInnerHTML && (!props.type || props.type === 'text/javascript')) {
            badProp = '<script';
            Object.keys(props).forEach(prop => {
              badProp += ` ${prop}="${props[prop]}"`;
            });
            badProp += '/>';
          }
        }

        if (badProp) {
          console.warn(`Found conflicting amp tag "${child.type}" with conflicting prop ${badProp} in ${__NEXT_DATA__.page}. https://nextjs.org/docs/messages/conflicting-amp-tag`);
          return null;
        }
      } else {
        // non-amp mode
        if (type === 'link' && props.rel === 'amphtml') {
          hasAmphtmlRel = true;
        }
      }

      return child;
    }); // try to parse styles from fragment for backwards compat

    const curStyles = Array.isArray(styles) ? styles : [];

    if (inAmpMode && styles && // @ts-ignore Property 'props' does not exist on type ReactElement
    styles.props && // @ts-ignore Property 'props' does not exist on type ReactElement
    Array.isArray(styles.props.children)) {
      const hasStyles = el => {
        var ref2, ref3;
        return el === null || el === void 0 ? void 0 : (ref2 = el.props) === null || ref2 === void 0 ? void 0 : (ref3 = ref2.dangerouslySetInnerHTML) === null || ref3 === void 0 ? void 0 : ref3.__html;
      }; // @ts-ignore Property 'props' does not exist on type ReactElement


      styles.props.children.forEach(child => {
        if (Array.isArray(child)) {
          child.forEach(el => hasStyles(el) && curStyles.push(el));
        } else if (hasStyles(child)) {
          curStyles.push(child);
        }
      });
    }

    const files = getDocumentFiles(this.context.buildManifest, this.context.__NEXT_DATA__.page, inAmpMode);

    var _nonce, _nonce1;

    return /*#__PURE__*/_react.default.createElement("head", Object.assign({}, this.props), this.context.isDevelopment && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("style", {
      "data-next-hide-fouc": true,
      "data-ampdevmode": inAmpMode ? 'true' : undefined,
      dangerouslySetInnerHTML: {
        __html: `body{display:none}`
      }
    }), /*#__PURE__*/_react.default.createElement("noscript", {
      "data-next-hide-fouc": true,
      "data-ampdevmode": inAmpMode ? 'true' : undefined
    }, /*#__PURE__*/_react.default.createElement("style", {
      dangerouslySetInnerHTML: {
        __html: `body{display:block}`
      }
    }))), children,  false && /*#__PURE__*/0, head, /*#__PURE__*/_react.default.createElement("meta", {
      name: "next-head-count",
      content: _react.default.Children.count(head || []).toString()
    }), inAmpMode && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("meta", {
      name: "viewport",
      content: "width=device-width,minimum-scale=1,initial-scale=1"
    }), !hasCanonicalRel && /*#__PURE__*/_react.default.createElement("link", {
      rel: "canonical",
      href: canonicalBase + (0, _utils1).cleanAmpPath(dangerousAsPath)
    }), /*#__PURE__*/_react.default.createElement("link", {
      rel: "preload",
      as: "script",
      href: "https://cdn.ampproject.org/v0.js"
    }), styles && /*#__PURE__*/_react.default.createElement("style", {
      "amp-custom": "",
      dangerouslySetInnerHTML: {
        __html: curStyles.map(style => style.props.dangerouslySetInnerHTML.__html).join('').replace(/\/\*# sourceMappingURL=.*\*\//g, '').replace(/\/\*@ sourceURL=.*?\*\//g, '')
      }
    }), /*#__PURE__*/_react.default.createElement("style", {
      "amp-boilerplate": "",
      dangerouslySetInnerHTML: {
        __html: `body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`
      }
    }), /*#__PURE__*/_react.default.createElement("noscript", null, /*#__PURE__*/_react.default.createElement("style", {
      "amp-boilerplate": "",
      dangerouslySetInnerHTML: {
        __html: `body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`
      }
    })), /*#__PURE__*/_react.default.createElement("script", {
      async: true,
      src: "https://cdn.ampproject.org/v0.js"
    })), !inAmpMode && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, !hasAmphtmlRel && hybridAmp && /*#__PURE__*/_react.default.createElement("link", {
      rel: "amphtml",
      href: canonicalBase + getAmpPath(ampPath, dangerousAsPath)
    }),  true && this.getCssLinks(files),  true && /*#__PURE__*/_react.default.createElement("noscript", {
      "data-n-css": (_nonce = this.props.nonce) !== null && _nonce !== void 0 ? _nonce : ''
    }),  false && /*#__PURE__*/0, !disableRuntimeJS && !disableJsPreload && this.getPreloadDynamicChunks(), !disableRuntimeJS && !disableJsPreload && this.getPreloadMainLinks(files), !disableOptimizedLoading && !disableRuntimeJS && this.getPolyfillScripts(), !disableOptimizedLoading && !disableRuntimeJS && this.getPreNextScripts(), !disableOptimizedLoading && !disableRuntimeJS && this.getDynamicChunks(files), !disableOptimizedLoading && !disableRuntimeJS && this.getScripts(files),  false && 0,  false && /*#__PURE__*/0, this.context.isDevelopment && // this element is used to mount development styles so the
    // ordering matches production
    // (by default, style-loader injects at the bottom of <head />)

    /*#__PURE__*/
    _react.default.createElement("noscript", {
      id: "__next_css__DO_NOT_USE__"
    }), styles || null), /*#__PURE__*/_react.default.createElement(_react.default.Fragment, {}, ...(headTags || [])));
  }

}

exports.Head = Head;
Head.contextType = _documentContext.DocumentContext;

function Main() {
  const {
    inAmpMode,
    html,
    docComponentsRendered
  } = (0, _react).useContext(_documentContext.DocumentContext);
  docComponentsRendered.Main = true;
  if (inAmpMode) return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, _constants.AMP_RENDER_TARGET);
  return /*#__PURE__*/_react.default.createElement("div", {
    id: "__next",
    dangerouslySetInnerHTML: {
      __html: html
    }
  });
}

class NextScript extends _react.Component {
  getDynamicChunks(files) {
    return getDynamicChunks(this.context, this.props, files);
  }

  getPreNextScripts() {
    return getPreNextScripts(this.context, this.props);
  }

  getScripts(files) {
    return getScripts(this.context, this.props, files);
  }

  getPolyfillScripts() {
    return getPolyfillScripts(this.context, this.props);
  }

  static getInlineScriptSource(documentProps) {
    const {
      __NEXT_DATA__
    } = documentProps;

    try {
      const data = JSON.stringify(__NEXT_DATA__);
      return (0, _htmlescape).htmlEscapeJsonString(data);
    } catch (err) {
      if (err.message.indexOf('circular structure')) {
        throw new Error(`Circular structure in "getInitialProps" result of page "${__NEXT_DATA__.page}". https://nextjs.org/docs/messages/circular-structure`);
      }

      throw err;
    }
  }

  render() {
    const {
      assetPrefix,
      inAmpMode,
      buildManifest,
      unstable_runtimeJS,
      docComponentsRendered,
      devOnlyCacheBusterQueryString,
      disableOptimizedLoading
    } = this.context;
    const disableRuntimeJS = unstable_runtimeJS === false;
    docComponentsRendered.NextScript = true;

    if (inAmpMode) {
      if (false) {}

      const ampDevFiles = [...buildManifest.devFiles, ...buildManifest.polyfillFiles, ...buildManifest.ampDevFiles];
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, disableRuntimeJS ? null : /*#__PURE__*/_react.default.createElement("script", {
        id: "__NEXT_DATA__",
        type: "application/json",
        nonce: this.props.nonce,
        crossOrigin: this.props.crossOrigin || undefined,
        dangerouslySetInnerHTML: {
          __html: NextScript.getInlineScriptSource(this.context)
        },
        "data-ampdevmode": true
      }), ampDevFiles.map(file => /*#__PURE__*/_react.default.createElement("script", {
        key: file,
        src: `${assetPrefix}/_next/${file}${devOnlyCacheBusterQueryString}`,
        nonce: this.props.nonce,
        crossOrigin: this.props.crossOrigin || undefined,
        "data-ampdevmode": true
      })));
    }

    if (true) {
      if (this.props.crossOrigin) console.warn('Warning: `NextScript` attribute `crossOrigin` is deprecated. https://nextjs.org/docs/messages/doc-crossorigin-deprecated');
    }

    const files = getDocumentFiles(this.context.buildManifest, this.context.__NEXT_DATA__.page, inAmpMode);
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, !disableRuntimeJS && buildManifest.devFiles ? buildManifest.devFiles.map(file => /*#__PURE__*/_react.default.createElement("script", {
      key: file,
      src: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
      nonce: this.props.nonce,
      crossOrigin: this.props.crossOrigin || undefined
    })) : null, disableRuntimeJS ? null : /*#__PURE__*/_react.default.createElement("script", {
      id: "__NEXT_DATA__",
      type: "application/json",
      nonce: this.props.nonce,
      crossOrigin: this.props.crossOrigin || undefined,
      dangerouslySetInnerHTML: {
        __html: NextScript.getInlineScriptSource(this.context)
      }
    }), disableOptimizedLoading && !disableRuntimeJS && this.getPolyfillScripts(), disableOptimizedLoading && !disableRuntimeJS && this.getPreNextScripts(), disableOptimizedLoading && !disableRuntimeJS && this.getDynamicChunks(files), disableOptimizedLoading && !disableRuntimeJS && this.getScripts(files));
  }

}

exports.NextScript = NextScript;
NextScript.contextType = _documentContext.DocumentContext;
NextScript.safariNomoduleFix = '!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()},!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();';

function getAmpPath(ampPath, asPath) {
  return ampPath || `${asPath}${asPath.includes('?') ? '&' : '?'}amp=1`;
}

/***/ }),

/***/ "../server/get-page-files":
/*!*****************************************************!*\
  !*** external "next/dist/server/get-page-files.js" ***!
  \*****************************************************/
/***/ ((module) => {

module.exports = require("next/dist/server/get-page-files.js");

/***/ }),

/***/ "../server/htmlescape":
/*!*************************************************!*\
  !*** external "next/dist/server/htmlescape.js" ***!
  \*************************************************/
/***/ ((module) => {

module.exports = require("next/dist/server/htmlescape.js");

/***/ }),

/***/ "../server/utils":
/*!********************************************!*\
  !*** external "next/dist/server/utils.js" ***!
  \********************************************/
/***/ ((module) => {

module.exports = require("next/dist/server/utils.js");

/***/ }),

/***/ "../shared/lib/constants":
/*!****************************************************!*\
  !*** external "next/dist/shared/lib/constants.js" ***!
  \****************************************************/
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/constants.js");

/***/ }),

/***/ "../shared/lib/document-context":
/*!***********************************************************!*\
  !*** external "next/dist/shared/lib/document-context.js" ***!
  \***********************************************************/
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/document-context.js");

/***/ }),

/***/ "../shared/lib/head-manager-context":
/*!***************************************************************!*\
  !*** external "next/dist/shared/lib/head-manager-context.js" ***!
  \***************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/head-manager-context.js");

/***/ }),

/***/ "../shared/lib/utils":
/*!************************************************!*\
  !*** external "next/dist/shared/lib/utils.js" ***!
  \************************************************/
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/utils.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "styled-jsx/server":
/*!************************************!*\
  !*** external "styled-jsx/server" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("styled-jsx/server");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./node_modules/next/dist/pages/_document.js"));
module.exports = __webpack_exports__;

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUksQ0FBQ3FGLGdCQUE1QixJQUFnRCxLQUFLekYsa0JBQUwsRUFkL0IsRUFjMERJLHVCQUF1QixJQUFJLENBQUNxRixnQkFBNUIsSUFBZ0QsS0FBSzNFLGlCQUFMLEVBZDFHLEVBY29JVix1QkFBdUIsSUFBSSxDQUFDcUYsZ0JBQTVCLElBQWdELEtBQUtyRSxnQkFBTCxDQUFzQkMsS0FBdEIsQ0FkcEwsRUFja05qQix1QkFBdUIsSUFBSSxDQUFDcUYsZ0JBQTVCLElBQWdELEtBQUsvRCxVQUFMLENBQWdCTCxLQUFoQixDQWRsUSxDQUFyQjtBQWVIOztBQTNFcUM7O0FBNkUxQy9NLGtCQUFBLEdBQXFCdU8sVUFBckI7QUFDQUEsVUFBVSxDQUFDdUUsV0FBWCxHQUF5QnBJLGdCQUFnQixDQUFDVCxlQUExQztBQUNBc0UsVUFBVSxDQUFDb0YsaUJBQVgsR0FBK0IsMFRBQS9COztBQUNBLFNBQVNmLFVBQVQsQ0FBb0JoQyxPQUFwQixFQUE2QmdELE1BQTdCLEVBQXFDO0FBQ2pDLFNBQU9oRCxPQUFPLElBQUssR0FBRWdELE1BQU8sR0FBRUEsTUFBTSxDQUFDN0ssUUFBUCxDQUFnQixHQUFoQixJQUF1QixHQUF2QixHQUE2QixHQUFJLE9BQS9EO0FBQ0g7Ozs7Ozs7Ozs7QUMxa0JEOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQSIsInNvdXJjZXMiOlsid2VicGFjazovL3NvbmFsYW5jZXIvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2NsaWVudC9oZWFkLW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vc29uYWxhbmNlci8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvY2xpZW50L3JlcXVlc3QtaWRsZS1jYWxsYmFjay5qcyIsIndlYnBhY2s6Ly9zb25hbGFuY2VyLy4vbm9kZV9tb2R1bGVzL25leHQvZGlzdC9jbGllbnQvc2NyaXB0LmpzIiwid2VicGFjazovL3NvbmFsYW5jZXIvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L3BhZ2VzL19kb2N1bWVudC5qcyIsIndlYnBhY2s6Ly9zb25hbGFuY2VyL2V4dGVybmFsIFwibmV4dC9kaXN0L3NlcnZlci9nZXQtcGFnZS1maWxlcy5qc1wiIiwid2VicGFjazovL3NvbmFsYW5jZXIvZXh0ZXJuYWwgXCJuZXh0L2Rpc3Qvc2VydmVyL2h0bWxlc2NhcGUuanNcIiIsIndlYnBhY2s6Ly9zb25hbGFuY2VyL2V4dGVybmFsIFwibmV4dC9kaXN0L3NlcnZlci91dGlscy5qc1wiIiwid2VicGFjazovL3NvbmFsYW5jZXIvZXh0ZXJuYWwgXCJuZXh0L2Rpc3Qvc2hhcmVkL2xpYi9jb25zdGFudHMuanNcIiIsIndlYnBhY2s6Ly9zb25hbGFuY2VyL2V4dGVybmFsIFwibmV4dC9kaXN0L3NoYXJlZC9saWIvZG9jdW1lbnQtY29udGV4dC5qc1wiIiwid2VicGFjazovL3NvbmFsYW5jZXIvZXh0ZXJuYWwgXCJuZXh0L2Rpc3Qvc2hhcmVkL2xpYi9oZWFkLW1hbmFnZXItY29udGV4dC5qc1wiIiwid2VicGFjazovL3NvbmFsYW5jZXIvZXh0ZXJuYWwgXCJuZXh0L2Rpc3Qvc2hhcmVkL2xpYi91dGlscy5qc1wiIiwid2VicGFjazovL3NvbmFsYW5jZXIvZXh0ZXJuYWwgXCJyZWFjdFwiIiwid2VicGFjazovL3NvbmFsYW5jZXIvZXh0ZXJuYWwgXCJzdHlsZWQtanN4L3NlcnZlclwiIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gaW5pdEhlYWRNYW5hZ2VyO1xuZXhwb3J0cy5ET01BdHRyaWJ1dGVOYW1lcyA9IHZvaWQgMDtcbmNvbnN0IERPTUF0dHJpYnV0ZU5hbWVzID0ge1xuICAgIGFjY2VwdENoYXJzZXQ6ICdhY2NlcHQtY2hhcnNldCcsXG4gICAgY2xhc3NOYW1lOiAnY2xhc3MnLFxuICAgIGh0bWxGb3I6ICdmb3InLFxuICAgIGh0dHBFcXVpdjogJ2h0dHAtZXF1aXYnLFxuICAgIG5vTW9kdWxlOiAnbm9Nb2R1bGUnXG59O1xuZXhwb3J0cy5ET01BdHRyaWJ1dGVOYW1lcyA9IERPTUF0dHJpYnV0ZU5hbWVzO1xuZnVuY3Rpb24gcmVhY3RFbGVtZW50VG9ET00oeyB0eXBlICwgcHJvcHMgIH0pIHtcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG4gICAgZm9yKGNvbnN0IHAgaW4gcHJvcHMpe1xuICAgICAgICBpZiAoIXByb3BzLmhhc093blByb3BlcnR5KHApKSBjb250aW51ZTtcbiAgICAgICAgaWYgKHAgPT09ICdjaGlsZHJlbicgfHwgcCA9PT0gJ2Rhbmdlcm91c2x5U2V0SW5uZXJIVE1MJykgY29udGludWU7XG4gICAgICAgIC8vIHdlIGRvbid0IHJlbmRlciB1bmRlZmluZWQgcHJvcHMgdG8gdGhlIERPTVxuICAgICAgICBpZiAocHJvcHNbcF0gPT09IHVuZGVmaW5lZCkgY29udGludWU7XG4gICAgICAgIGNvbnN0IGF0dHIgPSBET01BdHRyaWJ1dGVOYW1lc1twXSB8fCBwLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmICh0eXBlID09PSAnc2NyaXB0JyAmJiAoYXR0ciA9PT0gJ2FzeW5jJyB8fCBhdHRyID09PSAnZGVmZXInIHx8IGF0dHIgPT09ICdub01vZHVsZScpKSB7XG4gICAgICAgICAgICBlbFthdHRyXSA9ICEhcHJvcHNbcF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0ciwgcHJvcHNbcF0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHsgY2hpbGRyZW4gLCBkYW5nZXJvdXNseVNldElubmVySFRNTCAgfSA9IHByb3BzO1xuICAgIGlmIChkYW5nZXJvdXNseVNldElubmVySFRNTCkge1xuICAgICAgICBlbC5pbm5lckhUTUwgPSBkYW5nZXJvdXNseVNldElubmVySFRNTC5fX2h0bWwgfHwgJyc7XG4gICAgfSBlbHNlIGlmIChjaGlsZHJlbikge1xuICAgICAgICBlbC50ZXh0Q29udGVudCA9IHR5cGVvZiBjaGlsZHJlbiA9PT0gJ3N0cmluZycgPyBjaGlsZHJlbiA6IEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pID8gY2hpbGRyZW4uam9pbignJykgOiAnJztcbiAgICB9XG4gICAgcmV0dXJuIGVsO1xufVxuZnVuY3Rpb24gdXBkYXRlRWxlbWVudHModHlwZSwgY29tcG9uZW50cykge1xuICAgIGNvbnN0IGhlYWRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgY29uc3QgaGVhZENvdW50RWwgPSBoZWFkRWwucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPW5leHQtaGVhZC1jb3VudF0nKTtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICBpZiAoIWhlYWRDb3VudEVsKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdXYXJuaW5nOiBuZXh0LWhlYWQtY291bnQgaXMgbWlzc2luZy4gaHR0cHM6Ly9uZXh0anMub3JnL2RvY3MvbWVzc2FnZXMvbmV4dC1oZWFkLWNvdW50LW1pc3NpbmcnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBoZWFkQ291bnQgPSBOdW1iZXIoaGVhZENvdW50RWwuY29udGVudCk7XG4gICAgY29uc3Qgb2xkVGFncyA9IFtdO1xuICAgIGZvcihsZXQgaSA9IDAsIGogPSBoZWFkQ291bnRFbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nOyBpIDwgaGVhZENvdW50OyBpKyssIGogPSBqLnByZXZpb3VzRWxlbWVudFNpYmxpbmcpe1xuICAgICAgICBpZiAoai50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IHR5cGUpIHtcbiAgICAgICAgICAgIG9sZFRhZ3MucHVzaChqKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBuZXdUYWdzID0gY29tcG9uZW50cy5tYXAocmVhY3RFbGVtZW50VG9ET00pLmZpbHRlcigobmV3VGFnKT0+e1xuICAgICAgICBmb3IobGV0IGsgPSAwLCBsZW4gPSBvbGRUYWdzLmxlbmd0aDsgayA8IGxlbjsgaysrKXtcbiAgICAgICAgICAgIGNvbnN0IG9sZFRhZyA9IG9sZFRhZ3Nba107XG4gICAgICAgICAgICBpZiAob2xkVGFnLmlzRXF1YWxOb2RlKG5ld1RhZykpIHtcbiAgICAgICAgICAgICAgICBvbGRUYWdzLnNwbGljZShrLCAxKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gICAgb2xkVGFncy5mb3JFYWNoKCh0KT0+dC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHQpXG4gICAgKTtcbiAgICBuZXdUYWdzLmZvckVhY2goKHQpPT5oZWFkRWwuaW5zZXJ0QmVmb3JlKHQsIGhlYWRDb3VudEVsKVxuICAgICk7XG4gICAgaGVhZENvdW50RWwuY29udGVudCA9IChoZWFkQ291bnQgLSBvbGRUYWdzLmxlbmd0aCArIG5ld1RhZ3MubGVuZ3RoKS50b1N0cmluZygpO1xufVxuZnVuY3Rpb24gaW5pdEhlYWRNYW5hZ2VyKCkge1xuICAgIGxldCB1cGRhdGVQcm9taXNlID0gbnVsbDtcbiAgICByZXR1cm4ge1xuICAgICAgICBtb3VudGVkSW5zdGFuY2VzOiBuZXcgU2V0KCksXG4gICAgICAgIHVwZGF0ZUhlYWQ6IChoZWFkKT0+e1xuICAgICAgICAgICAgY29uc3QgcHJvbWlzZSA9IHVwZGF0ZVByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpPT57XG4gICAgICAgICAgICAgICAgaWYgKHByb21pc2UgIT09IHVwZGF0ZVByb21pc2UpIHJldHVybjtcbiAgICAgICAgICAgICAgICB1cGRhdGVQcm9taXNlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBjb25zdCB0YWdzID0ge1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaGVhZC5mb3JFYWNoKChoKT0+e1xuICAgICAgICAgICAgICAgICAgICBpZiAoLy8gSWYgdGhlIGZvbnQgdGFnIGlzIGxvYWRlZCBvbmx5IG9uIGNsaWVudCBuYXZpZ2F0aW9uXG4gICAgICAgICAgICAgICAgICAgIC8vIGl0IHdvbid0IGJlIGlubGluZWQuIEluIHRoaXMgY2FzZSByZXZlcnQgdG8gdGhlIG9yaWdpbmFsIGJlaGF2aW9yXG4gICAgICAgICAgICAgICAgICAgIGgudHlwZSA9PT0gJ2xpbmsnICYmIGgucHJvcHNbJ2RhdGEtb3B0aW1pemVkLWZvbnRzJ10gJiYgIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHN0eWxlW2RhdGEtaHJlZj1cIiR7aC5wcm9wc1snZGF0YS1ocmVmJ119XCJdYCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGgucHJvcHMuaHJlZiA9IGgucHJvcHNbJ2RhdGEtaHJlZiddO1xuICAgICAgICAgICAgICAgICAgICAgICAgaC5wcm9wc1snZGF0YS1ocmVmJ10gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29tcG9uZW50cyA9IHRhZ3NbaC50eXBlXSB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cy5wdXNoKGgpO1xuICAgICAgICAgICAgICAgICAgICB0YWdzW2gudHlwZV0gPSBjb21wb25lbnRzO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlQ29tcG9uZW50ID0gdGFncy50aXRsZSA/IHRhZ3MudGl0bGVbMF0gOiBudWxsO1xuICAgICAgICAgICAgICAgIGxldCB0aXRsZSA9ICcnO1xuICAgICAgICAgICAgICAgIGlmICh0aXRsZUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGNoaWxkcmVuICB9ID0gdGl0bGVDb21wb25lbnQucHJvcHM7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gdHlwZW9mIGNoaWxkcmVuID09PSAnc3RyaW5nJyA/IGNoaWxkcmVuIDogQXJyYXkuaXNBcnJheShjaGlsZHJlbikgPyBjaGlsZHJlbi5qb2luKCcnKSA6ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGl0bGUgIT09IGRvY3VtZW50LnRpdGxlKSBkb2N1bWVudC50aXRsZSA9IHRpdGxlO1xuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ21ldGEnLFxuICAgICAgICAgICAgICAgICAgICAnYmFzZScsXG4gICAgICAgICAgICAgICAgICAgICdsaW5rJyxcbiAgICAgICAgICAgICAgICAgICAgJ3N0eWxlJyxcbiAgICAgICAgICAgICAgICAgICAgJ3NjcmlwdCdcbiAgICAgICAgICAgICAgICBdLmZvckVhY2goKHR5cGUpPT57XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnRzKHR5cGUsIHRhZ3NbdHlwZV0gfHwgW10pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1oZWFkLW1hbmFnZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLnJlcXVlc3RJZGxlQ2FsbGJhY2sgPSBleHBvcnRzLmNhbmNlbElkbGVDYWxsYmFjayA9IHZvaWQgMDtcbmNvbnN0IHJlcXVlc3RJZGxlQ2FsbGJhY2sgPSB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5yZXF1ZXN0SWRsZUNhbGxiYWNrICYmIHNlbGYucmVxdWVzdElkbGVDYWxsYmFjay5iaW5kKHdpbmRvdykgfHwgZnVuY3Rpb24oY2IpIHtcbiAgICBsZXQgc3RhcnQgPSBEYXRlLm5vdygpO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBjYih7XG4gICAgICAgICAgICBkaWRUaW1lb3V0OiBmYWxzZSxcbiAgICAgICAgICAgIHRpbWVSZW1haW5pbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLm1heCgwLCA1MCAtIChEYXRlLm5vdygpIC0gc3RhcnQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSwgMSk7XG59O1xuZXhwb3J0cy5yZXF1ZXN0SWRsZUNhbGxiYWNrID0gcmVxdWVzdElkbGVDYWxsYmFjaztcbmNvbnN0IGNhbmNlbElkbGVDYWxsYmFjayA9IHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyAmJiBzZWxmLmNhbmNlbElkbGVDYWxsYmFjayAmJiBzZWxmLmNhbmNlbElkbGVDYWxsYmFjay5iaW5kKHdpbmRvdykgfHwgZnVuY3Rpb24oaWQpIHtcbiAgICByZXR1cm4gY2xlYXJUaW1lb3V0KGlkKTtcbn07XG5leHBvcnRzLmNhbmNlbElkbGVDYWxsYmFjayA9IGNhbmNlbElkbGVDYWxsYmFjaztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVxdWVzdC1pZGxlLWNhbGxiYWNrLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5pbml0U2NyaXB0TG9hZGVyID0gaW5pdFNjcmlwdExvYWRlcjtcbmV4cG9ydHMuZGVmYXVsdCA9IHZvaWQgMDtcbnZhciBfcmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG52YXIgX2hlYWRNYW5hZ2VyQ29udGV4dCA9IHJlcXVpcmUoXCIuLi9zaGFyZWQvbGliL2hlYWQtbWFuYWdlci1jb250ZXh0XCIpO1xudmFyIF9oZWFkTWFuYWdlciA9IHJlcXVpcmUoXCIuL2hlYWQtbWFuYWdlclwiKTtcbnZhciBfcmVxdWVzdElkbGVDYWxsYmFjayA9IHJlcXVpcmUoXCIuL3JlcXVlc3QtaWRsZS1jYWxsYmFja1wiKTtcbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcbiAgICBpZiAoa2V5IGluIG9iaikge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBvYmpba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xufVxuZnVuY3Rpb24gX29iamVjdFNwcmVhZCh0YXJnZXQpIHtcbiAgICBmb3IodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXSAhPSBudWxsID8gYXJndW1lbnRzW2ldIDoge1xuICAgICAgICB9O1xuICAgICAgICB2YXIgb3duS2V5cyA9IE9iamVjdC5rZXlzKHNvdXJjZSk7XG4gICAgICAgIGlmICh0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBvd25LZXlzID0gb3duS2V5cy5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzb3VyY2UpLmZpbHRlcihmdW5jdGlvbihzeW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIHN5bSkuZW51bWVyYWJsZTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICBvd25LZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICBfZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHNvdXJjZVtrZXldKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG59XG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoc291cmNlLCBleGNsdWRlZCkge1xuICAgIGlmIChzb3VyY2UgPT0gbnVsbCkgcmV0dXJuIHtcbiAgICB9O1xuICAgIHZhciB0YXJnZXQgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzb3VyY2UsIGV4Y2x1ZGVkKTtcbiAgICB2YXIga2V5LCBpO1xuICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgICAgIHZhciBzb3VyY2VTeW1ib2xLZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzb3VyY2UpO1xuICAgICAgICBmb3IoaSA9IDA7IGkgPCBzb3VyY2VTeW1ib2xLZXlzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGtleSA9IHNvdXJjZVN5bWJvbEtleXNbaV07XG4gICAgICAgICAgICBpZiAoZXhjbHVkZWQuaW5kZXhPZihrZXkpID49IDApIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwoc291cmNlLCBrZXkpKSBjb250aW51ZTtcbiAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbn1cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKHNvdXJjZSwgZXhjbHVkZWQpIHtcbiAgICBpZiAoc291cmNlID09IG51bGwpIHJldHVybiB7XG4gICAgfTtcbiAgICB2YXIgdGFyZ2V0ID0ge1xuICAgIH07XG4gICAgdmFyIHNvdXJjZUtleXMgPSBPYmplY3Qua2V5cyhzb3VyY2UpO1xuICAgIHZhciBrZXksIGk7XG4gICAgZm9yKGkgPSAwOyBpIDwgc291cmNlS2V5cy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIGtleSA9IHNvdXJjZUtleXNbaV07XG4gICAgICAgIGlmIChleGNsdWRlZC5pbmRleE9mKGtleSkgPj0gMCkgY29udGludWU7XG4gICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG59XG5jb25zdCBTY3JpcHRDYWNoZSA9IG5ldyBNYXAoKTtcbmNvbnN0IExvYWRDYWNoZSA9IG5ldyBTZXQoKTtcbmNvbnN0IGlnbm9yZVByb3BzID0gW1xuICAgICdvbkxvYWQnLFxuICAgICdkYW5nZXJvdXNseVNldElubmVySFRNTCcsXG4gICAgJ2NoaWxkcmVuJyxcbiAgICAnb25FcnJvcicsXG4gICAgJ3N0cmF0ZWd5JywgXG5dO1xuY29uc3QgbG9hZFNjcmlwdCA9IChwcm9wcyk9PntcbiAgICBjb25zdCB7IHNyYyAsIGlkICwgb25Mb2FkID0oKT0+e1xuICAgIH0gLCBkYW5nZXJvdXNseVNldElubmVySFRNTCAsIGNoaWxkcmVuID0nJyAsIG9uRXJyb3IgLCAgfSA9IHByb3BzO1xuICAgIGNvbnN0IGNhY2hlS2V5ID0gaWQgfHwgc3JjO1xuICAgIC8vIFNjcmlwdCBoYXMgYWxyZWFkeSBsb2FkZWRcbiAgICBpZiAoY2FjaGVLZXkgJiYgTG9hZENhY2hlLmhhcyhjYWNoZUtleSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBDb250ZW50cyBvZiB0aGlzIHNjcmlwdCBhcmUgYWxyZWFkeSBsb2FkaW5nL2xvYWRlZFxuICAgIGlmIChTY3JpcHRDYWNoZS5oYXMoc3JjKSkge1xuICAgICAgICBMb2FkQ2FjaGUuYWRkKGNhY2hlS2V5KTtcbiAgICAgICAgLy8gRXhlY3V0ZSBvbkxvYWQgc2luY2UgdGhlIHNjcmlwdCBsb2FkaW5nIGhhcyBiZWd1blxuICAgICAgICBTY3JpcHRDYWNoZS5nZXQoc3JjKS50aGVuKG9uTG9hZCwgb25FcnJvcik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICBjb25zdCBsb2FkUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICBpZiAob25Mb2FkKSB7XG4gICAgICAgICAgICAgICAgb25Mb2FkLmNhbGwodGhpcywgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgfSk7XG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAob25FcnJvcikge1xuICAgICAgICAgICAgb25FcnJvcihlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChzcmMpIHtcbiAgICAgICAgU2NyaXB0Q2FjaGUuc2V0KHNyYywgbG9hZFByb21pc2UpO1xuICAgIH1cbiAgICBMb2FkQ2FjaGUuYWRkKGNhY2hlS2V5KTtcbiAgICBpZiAoZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwpIHtcbiAgICAgICAgZWwuaW5uZXJIVE1MID0gZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwuX19odG1sIHx8ICcnO1xuICAgIH0gZWxzZSBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgZWwudGV4dENvbnRlbnQgPSB0eXBlb2YgY2hpbGRyZW4gPT09ICdzdHJpbmcnID8gY2hpbGRyZW4gOiBBcnJheS5pc0FycmF5KGNoaWxkcmVuKSA/IGNoaWxkcmVuLmpvaW4oJycpIDogJyc7XG4gICAgfSBlbHNlIGlmIChzcmMpIHtcbiAgICAgICAgZWwuc3JjID0gc3JjO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IFtrLCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocHJvcHMpKXtcbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgaWdub3JlUHJvcHMuaW5jbHVkZXMoaykpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGF0dHIgPSBfaGVhZE1hbmFnZXIuRE9NQXR0cmlidXRlTmFtZXNba10gfHwgay50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0ciwgdmFsdWUpO1xuICAgIH1cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsKTtcbn07XG5mdW5jdGlvbiBoYW5kbGVDbGllbnRTY3JpcHRMb2FkKHByb3BzKSB7XG4gICAgY29uc3QgeyBzdHJhdGVneSA9J2FmdGVySW50ZXJhY3RpdmUnICB9ID0gcHJvcHM7XG4gICAgaWYgKHN0cmF0ZWd5ID09PSAnYWZ0ZXJJbnRlcmFjdGl2ZScpIHtcbiAgICAgICAgbG9hZFNjcmlwdChwcm9wcyk7XG4gICAgfSBlbHNlIGlmIChzdHJhdGVneSA9PT0gJ2xhenlPbmxvYWQnKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCk9PntcbiAgICAgICAgICAgICgwLCBfcmVxdWVzdElkbGVDYWxsYmFjaykucmVxdWVzdElkbGVDYWxsYmFjaygoKT0+bG9hZFNjcmlwdChwcm9wcylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGxvYWRMYXp5U2NyaXB0KHByb3BzKSB7XG4gICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgICAgKDAsIF9yZXF1ZXN0SWRsZUNhbGxiYWNrKS5yZXF1ZXN0SWRsZUNhbGxiYWNrKCgpPT5sb2FkU2NyaXB0KHByb3BzKVxuICAgICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCk9PntcbiAgICAgICAgICAgICgwLCBfcmVxdWVzdElkbGVDYWxsYmFjaykucmVxdWVzdElkbGVDYWxsYmFjaygoKT0+bG9hZFNjcmlwdChwcm9wcylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGluaXRTY3JpcHRMb2FkZXIoc2NyaXB0TG9hZGVySXRlbXMpIHtcbiAgICBzY3JpcHRMb2FkZXJJdGVtcy5mb3JFYWNoKGhhbmRsZUNsaWVudFNjcmlwdExvYWQpO1xufVxuZnVuY3Rpb24gU2NyaXB0KHByb3BzKSB7XG4gICAgY29uc3QgeyBzcmMgPScnICwgb25Mb2FkID0oKT0+e1xuICAgIH0gLCBkYW5nZXJvdXNseVNldElubmVySFRNTCAsIHN0cmF0ZWd5ID0nYWZ0ZXJJbnRlcmFjdGl2ZScgLCBvbkVycm9yICB9ID0gcHJvcHMsIHJlc3RQcm9wcyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhwcm9wcywgW1wic3JjXCIsIFwib25Mb2FkXCIsIFwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUxcIiwgXCJzdHJhdGVneVwiLCBcIm9uRXJyb3JcIl0pO1xuICAgIC8vIENvbnRleHQgaXMgYXZhaWxhYmxlIG9ubHkgZHVyaW5nIFNTUlxuICAgIGNvbnN0IHsgdXBkYXRlU2NyaXB0cyAsIHNjcmlwdHMgIH0gPSAoMCwgX3JlYWN0KS51c2VDb250ZXh0KF9oZWFkTWFuYWdlckNvbnRleHQuSGVhZE1hbmFnZXJDb250ZXh0KTtcbiAgICAoMCwgX3JlYWN0KS51c2VFZmZlY3QoKCk9PntcbiAgICAgICAgaWYgKHN0cmF0ZWd5ID09PSAnYWZ0ZXJJbnRlcmFjdGl2ZScpIHtcbiAgICAgICAgICAgIGxvYWRTY3JpcHQocHJvcHMpO1xuICAgICAgICB9IGVsc2UgaWYgKHN0cmF0ZWd5ID09PSAnbGF6eU9ubG9hZCcpIHtcbiAgICAgICAgICAgIGxvYWRMYXp5U2NyaXB0KHByb3BzKTtcbiAgICAgICAgfVxuICAgIH0sIFtcbiAgICAgICAgcHJvcHMsXG4gICAgICAgIHN0cmF0ZWd5XG4gICAgXSk7XG4gICAgaWYgKHN0cmF0ZWd5ID09PSAnYmVmb3JlSW50ZXJhY3RpdmUnKSB7XG4gICAgICAgIGlmICh1cGRhdGVTY3JpcHRzKSB7XG4gICAgICAgICAgICBzY3JpcHRzLmJlZm9yZUludGVyYWN0aXZlID0gKHNjcmlwdHMuYmVmb3JlSW50ZXJhY3RpdmUgfHwgW10pLmNvbmNhdChbXG4gICAgICAgICAgICAgICAgX29iamVjdFNwcmVhZCh7XG4gICAgICAgICAgICAgICAgICAgIHNyYyxcbiAgICAgICAgICAgICAgICAgICAgb25Mb2FkLFxuICAgICAgICAgICAgICAgICAgICBvbkVycm9yXG4gICAgICAgICAgICAgICAgfSwgcmVzdFByb3BzKSwgXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIHVwZGF0ZVNjcmlwdHMoc2NyaXB0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2FkU2NyaXB0KHByb3BzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cbnZhciBfZGVmYXVsdCA9IFNjcmlwdDtcbmV4cG9ydHMuZGVmYXVsdCA9IF9kZWZhdWx0O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY3JpcHQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJEb2N1bWVudENvbnRleHRcIiwge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIF91dGlscy5Eb2N1bWVudENvbnRleHQ7XG4gICAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJEb2N1bWVudEluaXRpYWxQcm9wc1wiLCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX3V0aWxzLkRvY3VtZW50SW5pdGlhbFByb3BzO1xuICAgIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiRG9jdW1lbnRQcm9wc1wiLCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX3V0aWxzLkRvY3VtZW50UHJvcHM7XG4gICAgfVxufSk7XG5leHBvcnRzLkh0bWwgPSBIdG1sO1xuZXhwb3J0cy5NYWluID0gTWFpbjtcbmV4cG9ydHMuZGVmYXVsdCA9IHZvaWQgMDtcbnZhciBfcmVhY3QgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChyZXF1aXJlKFwicmVhY3RcIikpO1xudmFyIF9zZXJ2ZXIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJzdHlsZWQtanN4L3NlcnZlclwiKSk7XG52YXIgX2NvbnN0YW50cyA9IHJlcXVpcmUoXCIuLi9zaGFyZWQvbGliL2NvbnN0YW50c1wiKTtcbnZhciBfZG9jdW1lbnRDb250ZXh0ID0gcmVxdWlyZShcIi4uL3NoYXJlZC9saWIvZG9jdW1lbnQtY29udGV4dFwiKTtcbnZhciBfdXRpbHMgPSByZXF1aXJlKFwiLi4vc2hhcmVkL2xpYi91dGlsc1wiKTtcbnZhciBfZ2V0UGFnZUZpbGVzID0gcmVxdWlyZShcIi4uL3NlcnZlci9nZXQtcGFnZS1maWxlc1wiKTtcbnZhciBfdXRpbHMxID0gcmVxdWlyZShcIi4uL3NlcnZlci91dGlsc1wiKTtcbnZhciBfaHRtbGVzY2FwZSA9IHJlcXVpcmUoXCIuLi9zZXJ2ZXIvaHRtbGVzY2FwZVwiKTtcbnZhciBfc2NyaXB0ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vY2xpZW50L3NjcmlwdFwiKSk7XG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikge1xuICAgIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7XG4gICAgICAgIGRlZmF1bHQ6IG9ialxuICAgIH07XG59XG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHtcbiAgICBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG5ld09iaiA9IHtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKG9iaiAhPSBudWxsKSB7XG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiBvYmope1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkZXNjID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IHtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlc2MuZ2V0IHx8IGRlc2Muc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobmV3T2JqLCBrZXksIGRlc2MpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqW2tleV0gPSBvYmpba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBuZXdPYmouZGVmYXVsdCA9IG9iajtcbiAgICAgICAgcmV0dXJuIG5ld09iajtcbiAgICB9XG59XG5mdW5jdGlvbiBnZXREb2N1bWVudEZpbGVzKGJ1aWxkTWFuaWZlc3QsIHBhdGhuYW1lLCBpbkFtcE1vZGUpIHtcbiAgICBjb25zdCBzaGFyZWRGaWxlcyA9ICgwLCBfZ2V0UGFnZUZpbGVzKS5nZXRQYWdlRmlsZXMoYnVpbGRNYW5pZmVzdCwgJy9fYXBwJyk7XG4gICAgY29uc3QgcGFnZUZpbGVzID0gaW5BbXBNb2RlID8gW10gOiAoMCwgX2dldFBhZ2VGaWxlcykuZ2V0UGFnZUZpbGVzKGJ1aWxkTWFuaWZlc3QsIHBhdGhuYW1lKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBzaGFyZWRGaWxlcyxcbiAgICAgICAgcGFnZUZpbGVzLFxuICAgICAgICBhbGxGaWxlczogW1xuICAgICAgICAgICAgLi4ubmV3IFNldChbXG4gICAgICAgICAgICAgICAgLi4uc2hhcmVkRmlsZXMsXG4gICAgICAgICAgICAgICAgLi4ucGFnZUZpbGVzXG4gICAgICAgICAgICBdKVxuICAgICAgICBdXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGdldFBvbHlmaWxsU2NyaXB0cyhjb250ZXh0LCBwcm9wcykge1xuICAgIC8vIHBvbHlmaWxscy5qcyBoYXMgdG8gYmUgcmVuZGVyZWQgYXMgbm9tb2R1bGUgd2l0aG91dCBhc3luY1xuICAgIC8vIEl0IGFsc28gaGFzIHRvIGJlIHRoZSBmaXJzdCBzY3JpcHQgdG8gbG9hZFxuICAgIGNvbnN0IHsgYXNzZXRQcmVmaXggLCBidWlsZE1hbmlmZXN0ICwgZGV2T25seUNhY2hlQnVzdGVyUXVlcnlTdHJpbmcgLCBkaXNhYmxlT3B0aW1pemVkTG9hZGluZyAsICB9ID0gY29udGV4dDtcbiAgICByZXR1cm4gYnVpbGRNYW5pZmVzdC5wb2x5ZmlsbEZpbGVzLmZpbHRlcigocG9seWZpbGwpPT5wb2x5ZmlsbC5lbmRzV2l0aCgnLmpzJykgJiYgIXBvbHlmaWxsLmVuZHNXaXRoKCcubW9kdWxlLmpzJylcbiAgICApLm1hcCgocG9seWZpbGwpPT4vKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIiwge1xuICAgICAgICAgICAga2V5OiBwb2x5ZmlsbCxcbiAgICAgICAgICAgIGRlZmVyOiAhZGlzYWJsZU9wdGltaXplZExvYWRpbmcsXG4gICAgICAgICAgICBub25jZTogcHJvcHMubm9uY2UsXG4gICAgICAgICAgICBjcm9zc09yaWdpbjogcHJvcHMuY3Jvc3NPcmlnaW4gfHwgcHJvY2Vzcy5lbnYuX19ORVhUX0NST1NTX09SSUdJTixcbiAgICAgICAgICAgIG5vTW9kdWxlOiB0cnVlLFxuICAgICAgICAgICAgc3JjOiBgJHthc3NldFByZWZpeH0vX25leHQvJHtwb2x5ZmlsbH0ke2Rldk9ubHlDYWNoZUJ1c3RlclF1ZXJ5U3RyaW5nfWBcbiAgICAgICAgfSlcbiAgICApO1xufVxuZnVuY3Rpb24gZ2V0UHJlTmV4dFNjcmlwdHMoY29udGV4dCwgcHJvcHMpIHtcbiAgICBjb25zdCB7IHNjcmlwdExvYWRlciAsIGRpc2FibGVPcHRpbWl6ZWRMb2FkaW5nICB9ID0gY29udGV4dDtcbiAgICByZXR1cm4gKHNjcmlwdExvYWRlci5iZWZvcmVJbnRlcmFjdGl2ZSB8fCBbXSkubWFwKChmaWxlLCBpbmRleCk9PntcbiAgICAgICAgY29uc3QgeyBzdHJhdGVneSAsIC4uLnNjcmlwdFByb3BzIH0gPSBmaWxlO1xuICAgICAgICByZXR1cm4oLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIsIE9iamVjdC5hc3NpZ24oe1xuICAgICAgICB9LCBzY3JpcHRQcm9wcywge1xuICAgICAgICAgICAga2V5OiBzY3JpcHRQcm9wcy5zcmMgfHwgaW5kZXgsXG4gICAgICAgICAgICBkZWZlcjogIWRpc2FibGVPcHRpbWl6ZWRMb2FkaW5nLFxuICAgICAgICAgICAgbm9uY2U6IHByb3BzLm5vbmNlLFxuICAgICAgICAgICAgY3Jvc3NPcmlnaW46IHByb3BzLmNyb3NzT3JpZ2luIHx8IHByb2Nlc3MuZW52Ll9fTkVYVF9DUk9TU19PUklHSU5cbiAgICAgICAgfSkpKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGdldER5bmFtaWNDaHVua3MoY29udGV4dCwgcHJvcHMsIGZpbGVzKSB7XG4gICAgY29uc3QgeyBkeW5hbWljSW1wb3J0cyAsIGFzc2V0UHJlZml4ICwgaXNEZXZlbG9wbWVudCAsIGRldk9ubHlDYWNoZUJ1c3RlclF1ZXJ5U3RyaW5nICwgZGlzYWJsZU9wdGltaXplZExvYWRpbmcgLCAgfSA9IGNvbnRleHQ7XG4gICAgcmV0dXJuIGR5bmFtaWNJbXBvcnRzLm1hcCgoZmlsZSk9PntcbiAgICAgICAgaWYgKCFmaWxlLmVuZHNXaXRoKCcuanMnKSB8fCBmaWxlcy5hbGxGaWxlcy5pbmNsdWRlcyhmaWxlKSkgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybigvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIiwge1xuICAgICAgICAgICAgYXN5bmM6ICFpc0RldmVsb3BtZW50ICYmIGRpc2FibGVPcHRpbWl6ZWRMb2FkaW5nLFxuICAgICAgICAgICAgZGVmZXI6ICFkaXNhYmxlT3B0aW1pemVkTG9hZGluZyxcbiAgICAgICAgICAgIGtleTogZmlsZSxcbiAgICAgICAgICAgIHNyYzogYCR7YXNzZXRQcmVmaXh9L19uZXh0LyR7ZW5jb2RlVVJJKGZpbGUpfSR7ZGV2T25seUNhY2hlQnVzdGVyUXVlcnlTdHJpbmd9YCxcbiAgICAgICAgICAgIG5vbmNlOiBwcm9wcy5ub25jZSxcbiAgICAgICAgICAgIGNyb3NzT3JpZ2luOiBwcm9wcy5jcm9zc09yaWdpbiB8fCBwcm9jZXNzLmVudi5fX05FWFRfQ1JPU1NfT1JJR0lOXG4gICAgICAgIH0pKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGdldFNjcmlwdHMoY29udGV4dCwgcHJvcHMsIGZpbGVzKSB7XG4gICAgdmFyIHJlZjtcbiAgICBjb25zdCB7IGFzc2V0UHJlZml4ICwgYnVpbGRNYW5pZmVzdCAsIGlzRGV2ZWxvcG1lbnQgLCBkZXZPbmx5Q2FjaGVCdXN0ZXJRdWVyeVN0cmluZyAsIGRpc2FibGVPcHRpbWl6ZWRMb2FkaW5nICwgIH0gPSBjb250ZXh0O1xuICAgIGNvbnN0IG5vcm1hbFNjcmlwdHMgPSBmaWxlcy5hbGxGaWxlcy5maWx0ZXIoKGZpbGUpPT5maWxlLmVuZHNXaXRoKCcuanMnKVxuICAgICk7XG4gICAgY29uc3QgbG93UHJpb3JpdHlTY3JpcHRzID0gKHJlZiA9IGJ1aWxkTWFuaWZlc3QubG93UHJpb3JpdHlGaWxlcykgPT09IG51bGwgfHwgcmVmID09PSB2b2lkIDAgPyB2b2lkIDAgOiByZWYuZmlsdGVyKChmaWxlKT0+ZmlsZS5lbmRzV2l0aCgnLmpzJylcbiAgICApO1xuICAgIHJldHVybiBbXG4gICAgICAgIC4uLm5vcm1hbFNjcmlwdHMsXG4gICAgICAgIC4uLmxvd1ByaW9yaXR5U2NyaXB0c1xuICAgIF0ubWFwKChmaWxlKT0+e1xuICAgICAgICByZXR1cm4oLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIsIHtcbiAgICAgICAgICAgIGtleTogZmlsZSxcbiAgICAgICAgICAgIHNyYzogYCR7YXNzZXRQcmVmaXh9L19uZXh0LyR7ZW5jb2RlVVJJKGZpbGUpfSR7ZGV2T25seUNhY2hlQnVzdGVyUXVlcnlTdHJpbmd9YCxcbiAgICAgICAgICAgIG5vbmNlOiBwcm9wcy5ub25jZSxcbiAgICAgICAgICAgIGFzeW5jOiAhaXNEZXZlbG9wbWVudCAmJiBkaXNhYmxlT3B0aW1pemVkTG9hZGluZyxcbiAgICAgICAgICAgIGRlZmVyOiAhZGlzYWJsZU9wdGltaXplZExvYWRpbmcsXG4gICAgICAgICAgICBjcm9zc09yaWdpbjogcHJvcHMuY3Jvc3NPcmlnaW4gfHwgcHJvY2Vzcy5lbnYuX19ORVhUX0NST1NTX09SSUdJTlxuICAgICAgICB9KSk7XG4gICAgfSk7XG59XG5jbGFzcyBEb2N1bWVudDEgZXh0ZW5kcyBfcmVhY3QuQ29tcG9uZW50IHtcbiAgICAvKipcbiAgICogYGdldEluaXRpYWxQcm9wc2AgaG9vayByZXR1cm5zIHRoZSBjb250ZXh0IG9iamVjdCB3aXRoIHRoZSBhZGRpdGlvbiBvZiBgcmVuZGVyUGFnZWAuXG4gICAqIGByZW5kZXJQYWdlYCBjYWxsYmFjayBleGVjdXRlcyBgUmVhY3RgIHJlbmRlcmluZyBsb2dpYyBzeW5jaHJvbm91c2x5IHRvIHN1cHBvcnQgc2VydmVyLXJlbmRlcmluZyB3cmFwcGVyc1xuICAgKi8gc3RhdGljIGFzeW5jIGdldEluaXRpYWxQcm9wcyhjdHgpIHtcbiAgICAgICAgY29uc3QgZW5oYW5jZUFwcCA9IChBcHApPT57XG4gICAgICAgICAgICByZXR1cm4gKHByb3BzKT0+LyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KEFwcCwgT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICAgICAgfSwgcHJvcHMpKVxuICAgICAgICAgICAgO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCB7IGh0bWwgLCBoZWFkICB9ID0gYXdhaXQgY3R4LnJlbmRlclBhZ2Uoe1xuICAgICAgICAgICAgZW5oYW5jZUFwcFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgc3R5bGVzID0gW1xuICAgICAgICAgICAgLi4uKDAsIF9zZXJ2ZXIpLmRlZmF1bHQoKVxuICAgICAgICBdO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaHRtbCxcbiAgICAgICAgICAgIGhlYWQsXG4gICAgICAgICAgICBzdHlsZXNcbiAgICAgICAgfTtcbiAgICB9XG4gICAgc3RhdGljIHJlbmRlckRvY3VtZW50KERvY3VtZW50Q29tcG9uZW50LCBwcm9wcykge1xuICAgICAgICByZXR1cm4oLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9kb2N1bWVudENvbnRleHQuRG9jdW1lbnRDb250ZXh0LlByb3ZpZGVyLCB7XG4gICAgICAgICAgICB2YWx1ZTogcHJvcHNcbiAgICAgICAgfSwgLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KERvY3VtZW50Q29tcG9uZW50LCBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgfSwgcHJvcHMpKSkpO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybigvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoSHRtbCwgbnVsbCwgLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KEhlYWQsIG51bGwpLCAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJib2R5XCIsIG51bGwsIC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChNYWluLCBudWxsKSwgLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KE5leHRTY3JpcHQsIG51bGwpKSkpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IERvY3VtZW50MTtcbmZ1bmN0aW9uIEh0bWwocHJvcHMpIHtcbiAgICBjb25zdCB7IGluQW1wTW9kZSAsIGRvY0NvbXBvbmVudHNSZW5kZXJlZCAsIGxvY2FsZSAgfSA9ICgwLCBfcmVhY3QpLnVzZUNvbnRleHQoX2RvY3VtZW50Q29udGV4dC5Eb2N1bWVudENvbnRleHQpO1xuICAgIGRvY0NvbXBvbmVudHNSZW5kZXJlZC5IdG1sID0gdHJ1ZTtcbiAgICByZXR1cm4oLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiaHRtbFwiLCBPYmplY3QuYXNzaWduKHtcbiAgICB9LCBwcm9wcywge1xuICAgICAgICBsYW5nOiBwcm9wcy5sYW5nIHx8IGxvY2FsZSB8fCB1bmRlZmluZWQsXG4gICAgICAgIGFtcDogaW5BbXBNb2RlID8gJycgOiB1bmRlZmluZWQsXG4gICAgICAgIFwiZGF0YS1hbXBkZXZtb2RlXCI6IGluQW1wTW9kZSAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gJycgOiB1bmRlZmluZWRcbiAgICB9KSkpO1xufVxuY2xhc3MgSGVhZCBleHRlbmRzIF9yZWFjdC5Db21wb25lbnQge1xuICAgIGdldENzc0xpbmtzKGZpbGVzKSB7XG4gICAgICAgIGNvbnN0IHsgYXNzZXRQcmVmaXggLCBkZXZPbmx5Q2FjaGVCdXN0ZXJRdWVyeVN0cmluZyAsIGR5bmFtaWNJbXBvcnRzICwgIH0gPSB0aGlzLmNvbnRleHQ7XG4gICAgICAgIGNvbnN0IGNzc0ZpbGVzID0gZmlsZXMuYWxsRmlsZXMuZmlsdGVyKChmKT0+Zi5lbmRzV2l0aCgnLmNzcycpXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHNoYXJlZEZpbGVzID0gbmV3IFNldChmaWxlcy5zaGFyZWRGaWxlcyk7XG4gICAgICAgIC8vIFVubWFuYWdlZCBmaWxlcyBhcmUgQ1NTIGZpbGVzIHRoYXQgd2lsbCBiZSBoYW5kbGVkIGRpcmVjdGx5IGJ5IHRoZVxuICAgICAgICAvLyB3ZWJwYWNrIHJ1bnRpbWUgKGBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbmApLlxuICAgICAgICBsZXQgdW5tYW5nZWRGaWxlcyA9IG5ldyBTZXQoW10pO1xuICAgICAgICBsZXQgZHluYW1pY0Nzc0ZpbGVzID0gQXJyYXkuZnJvbShuZXcgU2V0KGR5bmFtaWNJbXBvcnRzLmZpbHRlcigoZmlsZSk9PmZpbGUuZW5kc1dpdGgoJy5jc3MnKVxuICAgICAgICApKSk7XG4gICAgICAgIGlmIChkeW5hbWljQ3NzRmlsZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBleGlzdGluZyA9IG5ldyBTZXQoY3NzRmlsZXMpO1xuICAgICAgICAgICAgZHluYW1pY0Nzc0ZpbGVzID0gZHluYW1pY0Nzc0ZpbGVzLmZpbHRlcigoZik9PiEoZXhpc3RpbmcuaGFzKGYpIHx8IHNoYXJlZEZpbGVzLmhhcyhmKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB1bm1hbmdlZEZpbGVzID0gbmV3IFNldChkeW5hbWljQ3NzRmlsZXMpO1xuICAgICAgICAgICAgY3NzRmlsZXMucHVzaCguLi5keW5hbWljQ3NzRmlsZXMpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjc3NMaW5rRWxlbWVudHMgPSBbXTtcbiAgICAgICAgY3NzRmlsZXMuZm9yRWFjaCgoZmlsZSk9PntcbiAgICAgICAgICAgIGNvbnN0IGlzU2hhcmVkRmlsZSA9IHNoYXJlZEZpbGVzLmhhcyhmaWxlKTtcbiAgICAgICAgICAgIGlmICghcHJvY2Vzcy5lbnYuX19ORVhUX09QVElNSVpFX0NTUykge1xuICAgICAgICAgICAgICAgIGNzc0xpbmtFbGVtZW50cy5wdXNoKC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImxpbmtcIiwge1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGAke2ZpbGV9LXByZWxvYWRgLFxuICAgICAgICAgICAgICAgICAgICBub25jZTogdGhpcy5wcm9wcy5ub25jZSxcbiAgICAgICAgICAgICAgICAgICAgcmVsOiBcInByZWxvYWRcIixcbiAgICAgICAgICAgICAgICAgICAgaHJlZjogYCR7YXNzZXRQcmVmaXh9L19uZXh0LyR7ZW5jb2RlVVJJKGZpbGUpfSR7ZGV2T25seUNhY2hlQnVzdGVyUXVlcnlTdHJpbmd9YCxcbiAgICAgICAgICAgICAgICAgICAgYXM6IFwic3R5bGVcIixcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3NPcmlnaW46IHRoaXMucHJvcHMuY3Jvc3NPcmlnaW4gfHwgcHJvY2Vzcy5lbnYuX19ORVhUX0NST1NTX09SSUdJTlxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGlzVW5tYW5hZ2VkRmlsZSA9IHVubWFuZ2VkRmlsZXMuaGFzKGZpbGUpO1xuICAgICAgICAgICAgY3NzTGlua0VsZW1lbnRzLnB1c2goLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwibGlua1wiLCB7XG4gICAgICAgICAgICAgICAga2V5OiBmaWxlLFxuICAgICAgICAgICAgICAgIG5vbmNlOiB0aGlzLnByb3BzLm5vbmNlLFxuICAgICAgICAgICAgICAgIHJlbDogXCJzdHlsZXNoZWV0XCIsXG4gICAgICAgICAgICAgICAgaHJlZjogYCR7YXNzZXRQcmVmaXh9L19uZXh0LyR7ZW5jb2RlVVJJKGZpbGUpfSR7ZGV2T25seUNhY2hlQnVzdGVyUXVlcnlTdHJpbmd9YCxcbiAgICAgICAgICAgICAgICBjcm9zc09yaWdpbjogdGhpcy5wcm9wcy5jcm9zc09yaWdpbiB8fCBwcm9jZXNzLmVudi5fX05FWFRfQ1JPU1NfT1JJR0lOLFxuICAgICAgICAgICAgICAgIFwiZGF0YS1uLWdcIjogaXNVbm1hbmFnZWRGaWxlID8gdW5kZWZpbmVkIDogaXNTaGFyZWRGaWxlID8gJycgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgXCJkYXRhLW4tcFwiOiBpc1VubWFuYWdlZEZpbGUgPyB1bmRlZmluZWQgOiBpc1NoYXJlZEZpbGUgPyB1bmRlZmluZWQgOiAnJ1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAnZGV2ZWxvcG1lbnQnICYmIHByb2Nlc3MuZW52Ll9fTkVYVF9PUFRJTUlaRV9GT05UUykge1xuICAgICAgICAgICAgY3NzTGlua0VsZW1lbnRzID0gdGhpcy5tYWtlU3R5bGVzaGVldEluZXJ0KGNzc0xpbmtFbGVtZW50cyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNzc0xpbmtFbGVtZW50cy5sZW5ndGggPT09IDAgPyBudWxsIDogY3NzTGlua0VsZW1lbnRzO1xuICAgIH1cbiAgICBnZXRQcmVsb2FkRHluYW1pY0NodW5rcygpIHtcbiAgICAgICAgY29uc3QgeyBkeW5hbWljSW1wb3J0cyAsIGFzc2V0UHJlZml4ICwgZGV2T25seUNhY2hlQnVzdGVyUXVlcnlTdHJpbmcgLCAgfSA9IHRoaXMuY29udGV4dDtcbiAgICAgICAgcmV0dXJuIGR5bmFtaWNJbXBvcnRzLm1hcCgoZmlsZSk9PntcbiAgICAgICAgICAgIGlmICghZmlsZS5lbmRzV2l0aCgnLmpzJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybigvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIsIHtcbiAgICAgICAgICAgICAgICByZWw6IFwicHJlbG9hZFwiLFxuICAgICAgICAgICAgICAgIGtleTogZmlsZSxcbiAgICAgICAgICAgICAgICBocmVmOiBgJHthc3NldFByZWZpeH0vX25leHQvJHtlbmNvZGVVUkkoZmlsZSl9JHtkZXZPbmx5Q2FjaGVCdXN0ZXJRdWVyeVN0cmluZ31gLFxuICAgICAgICAgICAgICAgIGFzOiBcInNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG5vbmNlOiB0aGlzLnByb3BzLm5vbmNlLFxuICAgICAgICAgICAgICAgIGNyb3NzT3JpZ2luOiB0aGlzLnByb3BzLmNyb3NzT3JpZ2luIHx8IHByb2Nlc3MuZW52Ll9fTkVYVF9DUk9TU19PUklHSU5cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSkvLyBGaWx0ZXIgb3V0IG51bGxlZCBzY3JpcHRzXG4gICAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG4gICAgfVxuICAgIGdldFByZWxvYWRNYWluTGlua3MoZmlsZXMpIHtcbiAgICAgICAgY29uc3QgeyBhc3NldFByZWZpeCAsIGRldk9ubHlDYWNoZUJ1c3RlclF1ZXJ5U3RyaW5nICwgc2NyaXB0TG9hZGVyICwgIH0gPSB0aGlzLmNvbnRleHQ7XG4gICAgICAgIGNvbnN0IHByZWxvYWRGaWxlcyA9IGZpbGVzLmFsbEZpbGVzLmZpbHRlcigoZmlsZSk9PntcbiAgICAgICAgICAgIHJldHVybiBmaWxlLmVuZHNXaXRoKCcuanMnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAuLi4oc2NyaXB0TG9hZGVyLmJlZm9yZUludGVyYWN0aXZlIHx8IFtdKS5tYXAoKGZpbGUpPT4vKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIsIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBmaWxlLnNyYyxcbiAgICAgICAgICAgICAgICAgICAgbm9uY2U6IHRoaXMucHJvcHMubm9uY2UsXG4gICAgICAgICAgICAgICAgICAgIHJlbDogXCJwcmVsb2FkXCIsXG4gICAgICAgICAgICAgICAgICAgIGhyZWY6IGZpbGUuc3JjLFxuICAgICAgICAgICAgICAgICAgICBhczogXCJzY3JpcHRcIixcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3NPcmlnaW46IHRoaXMucHJvcHMuY3Jvc3NPcmlnaW4gfHwgcHJvY2Vzcy5lbnYuX19ORVhUX0NST1NTX09SSUdJTlxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgLi4ucHJlbG9hZEZpbGVzLm1hcCgoZmlsZSk9Pi8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImxpbmtcIiwge1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGZpbGUsXG4gICAgICAgICAgICAgICAgICAgIG5vbmNlOiB0aGlzLnByb3BzLm5vbmNlLFxuICAgICAgICAgICAgICAgICAgICByZWw6IFwicHJlbG9hZFwiLFxuICAgICAgICAgICAgICAgICAgICBocmVmOiBgJHthc3NldFByZWZpeH0vX25leHQvJHtlbmNvZGVVUkkoZmlsZSl9JHtkZXZPbmx5Q2FjaGVCdXN0ZXJRdWVyeVN0cmluZ31gLFxuICAgICAgICAgICAgICAgICAgICBhczogXCJzY3JpcHRcIixcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3NPcmlnaW46IHRoaXMucHJvcHMuY3Jvc3NPcmlnaW4gfHwgcHJvY2Vzcy5lbnYuX19ORVhUX0NST1NTX09SSUdJTlxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApLCBcbiAgICAgICAgXTtcbiAgICB9XG4gICAgZ2V0RHluYW1pY0NodW5rcyhmaWxlcykge1xuICAgICAgICByZXR1cm4gZ2V0RHluYW1pY0NodW5rcyh0aGlzLmNvbnRleHQsIHRoaXMucHJvcHMsIGZpbGVzKTtcbiAgICB9XG4gICAgZ2V0UHJlTmV4dFNjcmlwdHMoKSB7XG4gICAgICAgIHJldHVybiBnZXRQcmVOZXh0U2NyaXB0cyh0aGlzLmNvbnRleHQsIHRoaXMucHJvcHMpO1xuICAgIH1cbiAgICBnZXRTY3JpcHRzKGZpbGVzKSB7XG4gICAgICAgIHJldHVybiBnZXRTY3JpcHRzKHRoaXMuY29udGV4dCwgdGhpcy5wcm9wcywgZmlsZXMpO1xuICAgIH1cbiAgICBnZXRQb2x5ZmlsbFNjcmlwdHMoKSB7XG4gICAgICAgIHJldHVybiBnZXRQb2x5ZmlsbFNjcmlwdHModGhpcy5jb250ZXh0LCB0aGlzLnByb3BzKTtcbiAgICB9XG4gICAgaGFuZGxlRG9jdW1lbnRTY3JpcHRMb2FkZXJJdGVtcyhjaGlsZHJlbikge1xuICAgICAgICBjb25zdCB7IHNjcmlwdExvYWRlciAgfSA9IHRoaXMuY29udGV4dDtcbiAgICAgICAgY29uc3Qgc2NyaXB0TG9hZGVySXRlbXMgPSBbXTtcbiAgICAgICAgY29uc3QgZmlsdGVyZWRDaGlsZHJlbiA9IFtdO1xuICAgICAgICBfcmVhY3QuZGVmYXVsdC5DaGlsZHJlbi5mb3JFYWNoKGNoaWxkcmVuLCAoY2hpbGQpPT57XG4gICAgICAgICAgICBpZiAoY2hpbGQudHlwZSA9PT0gX3NjcmlwdC5kZWZhdWx0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLnByb3BzLnN0cmF0ZWd5ID09PSAnYmVmb3JlSW50ZXJhY3RpdmUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcmlwdExvYWRlci5iZWZvcmVJbnRlcmFjdGl2ZSA9IChzY3JpcHRMb2FkZXIuYmVmb3JlSW50ZXJhY3RpdmUgfHwgW10pLmNvbmNhdChbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uY2hpbGQucHJvcHNcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxuICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoW1xuICAgICAgICAgICAgICAgICAgICAnbGF6eU9ubG9hZCcsXG4gICAgICAgICAgICAgICAgICAgICdhZnRlckludGVyYWN0aXZlJ1xuICAgICAgICAgICAgICAgIF0uaW5jbHVkZXMoY2hpbGQucHJvcHMuc3RyYXRlZ3kpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcmlwdExvYWRlckl0ZW1zLnB1c2goY2hpbGQucHJvcHMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmlsdGVyZWRDaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5fX05FWFRfREFUQV9fLnNjcmlwdExvYWRlciA9IHNjcmlwdExvYWRlckl0ZW1zO1xuICAgICAgICByZXR1cm4gZmlsdGVyZWRDaGlsZHJlbjtcbiAgICB9XG4gICAgbWFrZVN0eWxlc2hlZXRJbmVydChub2RlKSB7XG4gICAgICAgIHJldHVybiBfcmVhY3QuZGVmYXVsdC5DaGlsZHJlbi5tYXAobm9kZSwgKGMpPT57XG4gICAgICAgICAgICBpZiAoYy50eXBlID09PSAnbGluaycgJiYgYy5wcm9wc1snaHJlZiddICYmIF9jb25zdGFudHMuT1BUSU1JWkVEX0ZPTlRfUFJPVklERVJTLnNvbWUoKHsgdXJsICB9KT0+Yy5wcm9wc1snaHJlZiddLnN0YXJ0c1dpdGgodXJsKVxuICAgICAgICAgICAgKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1Byb3BzID0ge1xuICAgICAgICAgICAgICAgICAgICAuLi5jLnByb3BzIHx8IHtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbmV3UHJvcHNbJ2RhdGEtaHJlZiddID0gbmV3UHJvcHNbJ2hyZWYnXTtcbiAgICAgICAgICAgICAgICBuZXdQcm9wc1snaHJlZiddID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHJldHVybigvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNsb25lRWxlbWVudChjLCBuZXdQcm9wcykpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjLnByb3BzICYmIGMucHJvcHNbJ2NoaWxkcmVuJ10pIHtcbiAgICAgICAgICAgICAgICBjLnByb3BzWydjaGlsZHJlbiddID0gdGhpcy5tYWtlU3R5bGVzaGVldEluZXJ0KGMucHJvcHNbJ2NoaWxkcmVuJ10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGM7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgc3R5bGVzICwgYW1wUGF0aCAsIGluQW1wTW9kZSAsIGh5YnJpZEFtcCAsIGNhbm9uaWNhbEJhc2UgLCBfX05FWFRfREFUQV9fICwgZGFuZ2Vyb3VzQXNQYXRoICwgaGVhZFRhZ3MgLCB1bnN0YWJsZV9ydW50aW1lSlMgLCB1bnN0YWJsZV9Kc1ByZWxvYWQgLCBkaXNhYmxlT3B0aW1pemVkTG9hZGluZyAsICB9ID0gdGhpcy5jb250ZXh0O1xuICAgICAgICBjb25zdCBkaXNhYmxlUnVudGltZUpTID0gdW5zdGFibGVfcnVudGltZUpTID09PSBmYWxzZTtcbiAgICAgICAgY29uc3QgZGlzYWJsZUpzUHJlbG9hZCA9IHVuc3RhYmxlX0pzUHJlbG9hZCA9PT0gZmFsc2UgfHwgIWRpc2FibGVPcHRpbWl6ZWRMb2FkaW5nO1xuICAgICAgICB0aGlzLmNvbnRleHQuZG9jQ29tcG9uZW50c1JlbmRlcmVkLkhlYWQgPSB0cnVlO1xuICAgICAgICBsZXQgeyBoZWFkICB9ID0gdGhpcy5jb250ZXh0O1xuICAgICAgICBsZXQgY3NzUHJlbG9hZHMgPSBbXTtcbiAgICAgICAgbGV0IG90aGVySGVhZEVsZW1lbnRzID0gW107XG4gICAgICAgIGlmIChoZWFkKSB7XG4gICAgICAgICAgICBoZWFkLmZvckVhY2goKGMpPT57XG4gICAgICAgICAgICAgICAgaWYgKGMgJiYgYy50eXBlID09PSAnbGluaycgJiYgYy5wcm9wc1sncmVsJ10gPT09ICdwcmVsb2FkJyAmJiBjLnByb3BzWydhcyddID09PSAnc3R5bGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNzc1ByZWxvYWRzLnB1c2goYyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYyAmJiBvdGhlckhlYWRFbGVtZW50cy5wdXNoKGMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaGVhZCA9IGNzc1ByZWxvYWRzLmNvbmNhdChvdGhlckhlYWRFbGVtZW50cyk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNoaWxkcmVuID0gX3JlYWN0LmRlZmF1bHQuQ2hpbGRyZW4udG9BcnJheSh0aGlzLnByb3BzLmNoaWxkcmVuKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICAgIC8vIHNob3cgYSB3YXJuaW5nIGlmIEhlYWQgY29udGFpbnMgPHRpdGxlPiAob25seSBpbiBkZXZlbG9wbWVudClcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgIGNoaWxkcmVuID0gX3JlYWN0LmRlZmF1bHQuQ2hpbGRyZW4ubWFwKGNoaWxkcmVuLCAoY2hpbGQpPT57XG4gICAgICAgICAgICAgICAgdmFyIHJlZjtcbiAgICAgICAgICAgICAgICBjb25zdCBpc1JlYWN0SGVsbWV0ID0gY2hpbGQgPT09IG51bGwgfHwgY2hpbGQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChyZWYgPSBjaGlsZC5wcm9wcykgPT09IG51bGwgfHwgcmVmID09PSB2b2lkIDAgPyB2b2lkIDAgOiByZWZbJ2RhdGEtcmVhY3QtaGVsbWV0J107XG4gICAgICAgICAgICAgICAgaWYgKCFpc1JlYWN0SGVsbWV0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZWYxO1xuICAgICAgICAgICAgICAgICAgICBpZiAoKGNoaWxkID09PSBudWxsIHx8IGNoaWxkID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjaGlsZC50eXBlKSA9PT0gJ3RpdGxlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiV2FybmluZzogPHRpdGxlPiBzaG91bGQgbm90IGJlIHVzZWQgaW4gX2RvY3VtZW50LmpzJ3MgPEhlYWQ+LiBodHRwczovL25leHRqcy5vcmcvZG9jcy9tZXNzYWdlcy9uby1kb2N1bWVudC10aXRsZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgoY2hpbGQgPT09IG51bGwgfHwgY2hpbGQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNoaWxkLnR5cGUpID09PSAnbWV0YScgJiYgKGNoaWxkID09PSBudWxsIHx8IGNoaWxkID09PSB2b2lkIDAgPyB2b2lkIDAgOiAocmVmMSA9IGNoaWxkLnByb3BzKSA9PT0gbnVsbCB8fCByZWYxID09PSB2b2lkIDAgPyB2b2lkIDAgOiByZWYxLm5hbWUpID09PSAndmlld3BvcnQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiB2aWV3cG9ydCBtZXRhIHRhZ3Mgc2hvdWxkIG5vdCBiZSB1c2VkIGluIF9kb2N1bWVudC5qcydzIDxIZWFkPi4gaHR0cHM6Ly9uZXh0anMub3JnL2RvY3MvbWVzc2FnZXMvbm8tZG9jdW1lbnQtdmlld3BvcnQtbWV0YVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLmNyb3NzT3JpZ2luKSBjb25zb2xlLndhcm4oJ1dhcm5pbmc6IGBIZWFkYCBhdHRyaWJ1dGUgYGNyb3NzT3JpZ2luYCBpcyBkZXByZWNhdGVkLiBodHRwczovL25leHRqcy5vcmcvZG9jcy9tZXNzYWdlcy9kb2MtY3Jvc3NvcmlnaW4tZGVwcmVjYXRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ2RldmVsb3BtZW50JyAmJiBwcm9jZXNzLmVudi5fX05FWFRfT1BUSU1JWkVfRk9OVFMgJiYgIWluQW1wTW9kZSkge1xuICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLm1ha2VTdHlsZXNoZWV0SW5lcnQoY2hpbGRyZW4pO1xuICAgICAgICB9XG4gICAgICAgIGNoaWxkcmVuID0gdGhpcy5oYW5kbGVEb2N1bWVudFNjcmlwdExvYWRlckl0ZW1zKGNoaWxkcmVuKTtcbiAgICAgICAgbGV0IGhhc0FtcGh0bWxSZWwgPSBmYWxzZTtcbiAgICAgICAgbGV0IGhhc0Nhbm9uaWNhbFJlbCA9IGZhbHNlO1xuICAgICAgICAvLyBzaG93IHdhcm5pbmcgYW5kIHJlbW92ZSBjb25mbGljdGluZyBhbXAgaGVhZCB0YWdzXG4gICAgICAgIGhlYWQgPSBfcmVhY3QuZGVmYXVsdC5DaGlsZHJlbi5tYXAoaGVhZCB8fCBbXSwgKGNoaWxkKT0+e1xuICAgICAgICAgICAgaWYgKCFjaGlsZCkgcmV0dXJuIGNoaWxkO1xuICAgICAgICAgICAgY29uc3QgeyB0eXBlICwgcHJvcHMgIH0gPSBjaGlsZDtcbiAgICAgICAgICAgIGlmIChpbkFtcE1vZGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgYmFkUHJvcCA9ICcnO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAnbWV0YScgJiYgcHJvcHMubmFtZSA9PT0gJ3ZpZXdwb3J0Jykge1xuICAgICAgICAgICAgICAgICAgICBiYWRQcm9wID0gJ25hbWU9XCJ2aWV3cG9ydFwiJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdsaW5rJyAmJiBwcm9wcy5yZWwgPT09ICdjYW5vbmljYWwnKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc0Nhbm9uaWNhbFJlbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnc2NyaXB0Jykge1xuICAgICAgICAgICAgICAgICAgICAvLyBvbmx5IGJsb2NrIGlmXG4gICAgICAgICAgICAgICAgICAgIC8vIDEuIGl0IGhhcyBhIHNyYyBhbmQgaXNuJ3QgcG9pbnRpbmcgdG8gYW1wcHJvamVjdCdzIENETlxuICAgICAgICAgICAgICAgICAgICAvLyAyLiBpdCBpcyB1c2luZyBkYW5nZXJvdXNseVNldElubmVySFRNTCB3aXRob3V0IGEgdHlwZSBvclxuICAgICAgICAgICAgICAgICAgICAvLyBhIHR5cGUgb2YgdGV4dC9qYXZhc2NyaXB0XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wcy5zcmMgJiYgcHJvcHMuc3JjLmluZGV4T2YoJ2FtcHByb2plY3QnKSA8IC0xIHx8IHByb3BzLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MICYmICghcHJvcHMudHlwZSB8fCBwcm9wcy50eXBlID09PSAndGV4dC9qYXZhc2NyaXB0JykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhZFByb3AgPSAnPHNjcmlwdCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhwcm9wcykuZm9yRWFjaCgocHJvcCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWRQcm9wICs9IGAgJHtwcm9wfT1cIiR7cHJvcHNbcHJvcF19XCJgO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYWRQcm9wICs9ICcvPic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGJhZFByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBGb3VuZCBjb25mbGljdGluZyBhbXAgdGFnIFwiJHtjaGlsZC50eXBlfVwiIHdpdGggY29uZmxpY3RpbmcgcHJvcCAke2JhZFByb3B9IGluICR7X19ORVhUX0RBVEFfXy5wYWdlfS4gaHR0cHM6Ly9uZXh0anMub3JnL2RvY3MvbWVzc2FnZXMvY29uZmxpY3RpbmctYW1wLXRhZ2ApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIG5vbi1hbXAgbW9kZVxuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAnbGluaycgJiYgcHJvcHMucmVsID09PSAnYW1waHRtbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzQW1waHRtbFJlbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gdHJ5IHRvIHBhcnNlIHN0eWxlcyBmcm9tIGZyYWdtZW50IGZvciBiYWNrd2FyZHMgY29tcGF0XG4gICAgICAgIGNvbnN0IGN1clN0eWxlcyA9IEFycmF5LmlzQXJyYXkoc3R5bGVzKSA/IHN0eWxlcyA6IFtdO1xuICAgICAgICBpZiAoaW5BbXBNb2RlICYmIHN0eWxlcyAmJiAvLyBAdHMtaWdub3JlIFByb3BlcnR5ICdwcm9wcycgZG9lcyBub3QgZXhpc3Qgb24gdHlwZSBSZWFjdEVsZW1lbnRcbiAgICAgICAgc3R5bGVzLnByb3BzICYmIC8vIEB0cy1pZ25vcmUgUHJvcGVydHkgJ3Byb3BzJyBkb2VzIG5vdCBleGlzdCBvbiB0eXBlIFJlYWN0RWxlbWVudFxuICAgICAgICBBcnJheS5pc0FycmF5KHN0eWxlcy5wcm9wcy5jaGlsZHJlbikpIHtcbiAgICAgICAgICAgIGNvbnN0IGhhc1N0eWxlcyA9IChlbCk9PntcbiAgICAgICAgICAgICAgICB2YXIgcmVmMiwgcmVmMztcbiAgICAgICAgICAgICAgICByZXR1cm4gZWwgPT09IG51bGwgfHwgZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChyZWYyID0gZWwucHJvcHMpID09PSBudWxsIHx8IHJlZjIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChyZWYzID0gcmVmMi5kYW5nZXJvdXNseVNldElubmVySFRNTCkgPT09IG51bGwgfHwgcmVmMyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcmVmMy5fX2h0bWw7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSBQcm9wZXJ0eSAncHJvcHMnIGRvZXMgbm90IGV4aXN0IG9uIHR5cGUgUmVhY3RFbGVtZW50XG4gICAgICAgICAgICBzdHlsZXMucHJvcHMuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpPT57XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLmZvckVhY2goKGVsKT0+aGFzU3R5bGVzKGVsKSAmJiBjdXJTdHlsZXMucHVzaChlbClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGhhc1N0eWxlcyhjaGlsZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyU3R5bGVzLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZpbGVzID0gZ2V0RG9jdW1lbnRGaWxlcyh0aGlzLmNvbnRleHQuYnVpbGRNYW5pZmVzdCwgdGhpcy5jb250ZXh0Ll9fTkVYVF9EQVRBX18ucGFnZSwgaW5BbXBNb2RlKTtcbiAgICAgICAgdmFyIF9ub25jZSwgX25vbmNlMTtcbiAgICAgICAgcmV0dXJuKC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImhlYWRcIiwgT2JqZWN0LmFzc2lnbih7XG4gICAgICAgIH0sIHRoaXMucHJvcHMpLCB0aGlzLmNvbnRleHQuaXNEZXZlbG9wbWVudCAmJiAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX3JlYWN0LmRlZmF1bHQuRnJhZ21lbnQsIG51bGwsIC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIsIHtcbiAgICAgICAgICAgIFwiZGF0YS1uZXh0LWhpZGUtZm91Y1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJkYXRhLWFtcGRldm1vZGVcIjogaW5BbXBNb2RlID8gJ3RydWUnIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6IHtcbiAgICAgICAgICAgICAgICBfX2h0bWw6IGBib2R5e2Rpc3BsYXk6bm9uZX1gXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLCAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJub3NjcmlwdFwiLCB7XG4gICAgICAgICAgICBcImRhdGEtbmV4dC1oaWRlLWZvdWNcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiZGF0YS1hbXBkZXZtb2RlXCI6IGluQW1wTW9kZSA/ICd0cnVlJyA6IHVuZGVmaW5lZFxuICAgICAgICB9LCAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiLCB7XG4gICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTDoge1xuICAgICAgICAgICAgICAgIF9faHRtbDogYGJvZHl7ZGlzcGxheTpibG9ja31gXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKSksIGNoaWxkcmVuLCBwcm9jZXNzLmVudi5fX05FWFRfT1BUSU1JWkVfRk9OVFMgJiYgLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwibWV0YVwiLCB7XG4gICAgICAgICAgICBuYW1lOiBcIm5leHQtZm9udC1wcmVjb25uZWN0XCJcbiAgICAgICAgfSksIGhlYWQsIC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcIm1ldGFcIiwge1xuICAgICAgICAgICAgbmFtZTogXCJuZXh0LWhlYWQtY291bnRcIixcbiAgICAgICAgICAgIGNvbnRlbnQ6IF9yZWFjdC5kZWZhdWx0LkNoaWxkcmVuLmNvdW50KGhlYWQgfHwgW10pLnRvU3RyaW5nKClcbiAgICAgICAgfSksIGluQW1wTW9kZSAmJiAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX3JlYWN0LmRlZmF1bHQuRnJhZ21lbnQsIG51bGwsIC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcIm1ldGFcIiwge1xuICAgICAgICAgICAgbmFtZTogXCJ2aWV3cG9ydFwiLFxuICAgICAgICAgICAgY29udGVudDogXCJ3aWR0aD1kZXZpY2Utd2lkdGgsbWluaW11bS1zY2FsZT0xLGluaXRpYWwtc2NhbGU9MVwiXG4gICAgICAgIH0pLCAhaGFzQ2Fub25pY2FsUmVsICYmIC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImxpbmtcIiwge1xuICAgICAgICAgICAgcmVsOiBcImNhbm9uaWNhbFwiLFxuICAgICAgICAgICAgaHJlZjogY2Fub25pY2FsQmFzZSArICgwLCBfdXRpbHMxKS5jbGVhbkFtcFBhdGgoZGFuZ2Vyb3VzQXNQYXRoKVxuICAgICAgICB9KSwgLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwibGlua1wiLCB7XG4gICAgICAgICAgICByZWw6IFwicHJlbG9hZFwiLFxuICAgICAgICAgICAgYXM6IFwic2NyaXB0XCIsXG4gICAgICAgICAgICBocmVmOiBcImh0dHBzOi8vY2RuLmFtcHByb2plY3Qub3JnL3YwLmpzXCJcbiAgICAgICAgfSksIHN0eWxlcyAmJiAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiLCB7XG4gICAgICAgICAgICBcImFtcC1jdXN0b21cIjogXCJcIixcbiAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiB7XG4gICAgICAgICAgICAgICAgX19odG1sOiBjdXJTdHlsZXMubWFwKChzdHlsZSk9PnN0eWxlLnByb3BzLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLl9faHRtbFxuICAgICAgICAgICAgICAgICkuam9pbignJykucmVwbGFjZSgvXFwvXFwqIyBzb3VyY2VNYXBwaW5nVVJMPS4qXFwqXFwvL2csICcnKS5yZXBsYWNlKC9cXC9cXCpAIHNvdXJjZVVSTD0uKj9cXCpcXC8vZywgJycpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLCAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiLCB7XG4gICAgICAgICAgICBcImFtcC1ib2lsZXJwbGF0ZVwiOiBcIlwiLFxuICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6IHtcbiAgICAgICAgICAgICAgICBfX2h0bWw6IGBib2R5ey13ZWJraXQtYW5pbWF0aW9uOi1hbXAtc3RhcnQgOHMgc3RlcHMoMSxlbmQpIDBzIDEgbm9ybWFsIGJvdGg7LW1vei1hbmltYXRpb246LWFtcC1zdGFydCA4cyBzdGVwcygxLGVuZCkgMHMgMSBub3JtYWwgYm90aDstbXMtYW5pbWF0aW9uOi1hbXAtc3RhcnQgOHMgc3RlcHMoMSxlbmQpIDBzIDEgbm9ybWFsIGJvdGg7YW5pbWF0aW9uOi1hbXAtc3RhcnQgOHMgc3RlcHMoMSxlbmQpIDBzIDEgbm9ybWFsIGJvdGh9QC13ZWJraXQta2V5ZnJhbWVzIC1hbXAtc3RhcnR7ZnJvbXt2aXNpYmlsaXR5OmhpZGRlbn10b3t2aXNpYmlsaXR5OnZpc2libGV9fUAtbW96LWtleWZyYW1lcyAtYW1wLXN0YXJ0e2Zyb217dmlzaWJpbGl0eTpoaWRkZW59dG97dmlzaWJpbGl0eTp2aXNpYmxlfX1ALW1zLWtleWZyYW1lcyAtYW1wLXN0YXJ0e2Zyb217dmlzaWJpbGl0eTpoaWRkZW59dG97dmlzaWJpbGl0eTp2aXNpYmxlfX1ALW8ta2V5ZnJhbWVzIC1hbXAtc3RhcnR7ZnJvbXt2aXNpYmlsaXR5OmhpZGRlbn10b3t2aXNpYmlsaXR5OnZpc2libGV9fUBrZXlmcmFtZXMgLWFtcC1zdGFydHtmcm9te3Zpc2liaWxpdHk6aGlkZGVufXRve3Zpc2liaWxpdHk6dmlzaWJsZX19YFxuICAgICAgICAgICAgfVxuICAgICAgICB9KSwgLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwibm9zY3JpcHRcIiwgbnVsbCwgLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIiwge1xuICAgICAgICAgICAgXCJhbXAtYm9pbGVycGxhdGVcIjogXCJcIixcbiAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiB7XG4gICAgICAgICAgICAgICAgX19odG1sOiBgYm9keXstd2Via2l0LWFuaW1hdGlvbjpub25lOy1tb3otYW5pbWF0aW9uOm5vbmU7LW1zLWFuaW1hdGlvbjpub25lO2FuaW1hdGlvbjpub25lfWBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpLCAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIiwge1xuICAgICAgICAgICAgYXN5bmM6IHRydWUsXG4gICAgICAgICAgICBzcmM6IFwiaHR0cHM6Ly9jZG4uYW1wcHJvamVjdC5vcmcvdjAuanNcIlxuICAgICAgICB9KSksICFpbkFtcE1vZGUgJiYgLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9yZWFjdC5kZWZhdWx0LkZyYWdtZW50LCBudWxsLCAhaGFzQW1waHRtbFJlbCAmJiBoeWJyaWRBbXAgJiYgLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwibGlua1wiLCB7XG4gICAgICAgICAgICByZWw6IFwiYW1waHRtbFwiLFxuICAgICAgICAgICAgaHJlZjogY2Fub25pY2FsQmFzZSArIGdldEFtcFBhdGgoYW1wUGF0aCwgZGFuZ2Vyb3VzQXNQYXRoKVxuICAgICAgICB9KSwgIXByb2Nlc3MuZW52Ll9fTkVYVF9PUFRJTUlaRV9DU1MgJiYgdGhpcy5nZXRDc3NMaW5rcyhmaWxlcyksICFwcm9jZXNzLmVudi5fX05FWFRfT1BUSU1JWkVfQ1NTICYmIC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcIm5vc2NyaXB0XCIsIHtcbiAgICAgICAgICAgIFwiZGF0YS1uLWNzc1wiOiAoX25vbmNlID0gdGhpcy5wcm9wcy5ub25jZSkgIT09IG51bGwgJiYgX25vbmNlICE9PSB2b2lkIDAgPyBfbm9uY2UgOiAnJ1xuICAgICAgICB9KSwgcHJvY2Vzcy5lbnYuX19ORVhUX09QVElNSVpFX0lNQUdFUyAmJiAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJtZXRhXCIsIHtcbiAgICAgICAgICAgIG5hbWU6IFwibmV4dC1pbWFnZS1wcmVsb2FkXCJcbiAgICAgICAgfSksICFkaXNhYmxlUnVudGltZUpTICYmICFkaXNhYmxlSnNQcmVsb2FkICYmIHRoaXMuZ2V0UHJlbG9hZER5bmFtaWNDaHVua3MoKSwgIWRpc2FibGVSdW50aW1lSlMgJiYgIWRpc2FibGVKc1ByZWxvYWQgJiYgdGhpcy5nZXRQcmVsb2FkTWFpbkxpbmtzKGZpbGVzKSwgIWRpc2FibGVPcHRpbWl6ZWRMb2FkaW5nICYmICFkaXNhYmxlUnVudGltZUpTICYmIHRoaXMuZ2V0UG9seWZpbGxTY3JpcHRzKCksICFkaXNhYmxlT3B0aW1pemVkTG9hZGluZyAmJiAhZGlzYWJsZVJ1bnRpbWVKUyAmJiB0aGlzLmdldFByZU5leHRTY3JpcHRzKCksICFkaXNhYmxlT3B0aW1pemVkTG9hZGluZyAmJiAhZGlzYWJsZVJ1bnRpbWVKUyAmJiB0aGlzLmdldER5bmFtaWNDaHVua3MoZmlsZXMpLCAhZGlzYWJsZU9wdGltaXplZExvYWRpbmcgJiYgIWRpc2FibGVSdW50aW1lSlMgJiYgdGhpcy5nZXRTY3JpcHRzKGZpbGVzKSwgcHJvY2Vzcy5lbnYuX19ORVhUX09QVElNSVpFX0NTUyAmJiB0aGlzLmdldENzc0xpbmtzKGZpbGVzKSwgcHJvY2Vzcy5lbnYuX19ORVhUX09QVElNSVpFX0NTUyAmJiAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJub3NjcmlwdFwiLCB7XG4gICAgICAgICAgICBcImRhdGEtbi1jc3NcIjogKF9ub25jZTEgPSB0aGlzLnByb3BzLm5vbmNlKSAhPT0gbnVsbCAmJiBfbm9uY2UxICE9PSB2b2lkIDAgPyBfbm9uY2UxIDogJydcbiAgICAgICAgfSksIHRoaXMuY29udGV4dC5pc0RldmVsb3BtZW50ICYmIC8vIHRoaXMgZWxlbWVudCBpcyB1c2VkIHRvIG1vdW50IGRldmVsb3BtZW50IHN0eWxlcyBzbyB0aGVcbiAgICAgICAgLy8gb3JkZXJpbmcgbWF0Y2hlcyBwcm9kdWN0aW9uXG4gICAgICAgIC8vIChieSBkZWZhdWx0LCBzdHlsZS1sb2FkZXIgaW5qZWN0cyBhdCB0aGUgYm90dG9tIG9mIDxoZWFkIC8+KVxuICAgICAgICAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJub3NjcmlwdFwiLCB7XG4gICAgICAgICAgICBpZDogXCJfX25leHRfY3NzX19ET19OT1RfVVNFX19cIlxuICAgICAgICB9KSwgc3R5bGVzIHx8IG51bGwpLCAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX3JlYWN0LmRlZmF1bHQuRnJhZ21lbnQsIHtcbiAgICAgICAgfSwgLi4uaGVhZFRhZ3MgfHwgW10pKSk7XG4gICAgfVxufVxuZXhwb3J0cy5IZWFkID0gSGVhZDtcbkhlYWQuY29udGV4dFR5cGUgPSBfZG9jdW1lbnRDb250ZXh0LkRvY3VtZW50Q29udGV4dDtcbmZ1bmN0aW9uIE1haW4oKSB7XG4gICAgY29uc3QgeyBpbkFtcE1vZGUgLCBodG1sICwgZG9jQ29tcG9uZW50c1JlbmRlcmVkICB9ID0gKDAsIF9yZWFjdCkudXNlQ29udGV4dChfZG9jdW1lbnRDb250ZXh0LkRvY3VtZW50Q29udGV4dCk7XG4gICAgZG9jQ29tcG9uZW50c1JlbmRlcmVkLk1haW4gPSB0cnVlO1xuICAgIGlmIChpbkFtcE1vZGUpIHJldHVybigvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX3JlYWN0LmRlZmF1bHQuRnJhZ21lbnQsIG51bGwsIF9jb25zdGFudHMuQU1QX1JFTkRFUl9UQVJHRVQpKTtcbiAgICByZXR1cm4oLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcbiAgICAgICAgaWQ6IFwiX19uZXh0XCIsXG4gICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiB7XG4gICAgICAgICAgICBfX2h0bWw6IGh0bWxcbiAgICAgICAgfVxuICAgIH0pKTtcbn1cbmNsYXNzIE5leHRTY3JpcHQgZXh0ZW5kcyBfcmVhY3QuQ29tcG9uZW50IHtcbiAgICBnZXREeW5hbWljQ2h1bmtzKGZpbGVzKSB7XG4gICAgICAgIHJldHVybiBnZXREeW5hbWljQ2h1bmtzKHRoaXMuY29udGV4dCwgdGhpcy5wcm9wcywgZmlsZXMpO1xuICAgIH1cbiAgICBnZXRQcmVOZXh0U2NyaXB0cygpIHtcbiAgICAgICAgcmV0dXJuIGdldFByZU5leHRTY3JpcHRzKHRoaXMuY29udGV4dCwgdGhpcy5wcm9wcyk7XG4gICAgfVxuICAgIGdldFNjcmlwdHMoZmlsZXMpIHtcbiAgICAgICAgcmV0dXJuIGdldFNjcmlwdHModGhpcy5jb250ZXh0LCB0aGlzLnByb3BzLCBmaWxlcyk7XG4gICAgfVxuICAgIGdldFBvbHlmaWxsU2NyaXB0cygpIHtcbiAgICAgICAgcmV0dXJuIGdldFBvbHlmaWxsU2NyaXB0cyh0aGlzLmNvbnRleHQsIHRoaXMucHJvcHMpO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0SW5saW5lU2NyaXB0U291cmNlKGRvY3VtZW50UHJvcHMpIHtcbiAgICAgICAgY29uc3QgeyBfX05FWFRfREFUQV9fICB9ID0gZG9jdW1lbnRQcm9wcztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnN0cmluZ2lmeShfX05FWFRfREFUQV9fKTtcbiAgICAgICAgICAgIHJldHVybiAoMCwgX2h0bWxlc2NhcGUpLmh0bWxFc2NhcGVKc29uU3RyaW5nKGRhdGEpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIubWVzc2FnZS5pbmRleE9mKCdjaXJjdWxhciBzdHJ1Y3R1cmUnKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2lyY3VsYXIgc3RydWN0dXJlIGluIFwiZ2V0SW5pdGlhbFByb3BzXCIgcmVzdWx0IG9mIHBhZ2UgXCIke19fTkVYVF9EQVRBX18ucGFnZX1cIi4gaHR0cHM6Ly9uZXh0anMub3JnL2RvY3MvbWVzc2FnZXMvY2lyY3VsYXItc3RydWN0dXJlYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7IGFzc2V0UHJlZml4ICwgaW5BbXBNb2RlICwgYnVpbGRNYW5pZmVzdCAsIHVuc3RhYmxlX3J1bnRpbWVKUyAsIGRvY0NvbXBvbmVudHNSZW5kZXJlZCAsIGRldk9ubHlDYWNoZUJ1c3RlclF1ZXJ5U3RyaW5nICwgZGlzYWJsZU9wdGltaXplZExvYWRpbmcgLCAgfSA9IHRoaXMuY29udGV4dDtcbiAgICAgICAgY29uc3QgZGlzYWJsZVJ1bnRpbWVKUyA9IHVuc3RhYmxlX3J1bnRpbWVKUyA9PT0gZmFsc2U7XG4gICAgICAgIGRvY0NvbXBvbmVudHNSZW5kZXJlZC5OZXh0U2NyaXB0ID0gdHJ1ZTtcbiAgICAgICAgaWYgKGluQW1wTW9kZSkge1xuICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGFtcERldkZpbGVzID0gW1xuICAgICAgICAgICAgICAgIC4uLmJ1aWxkTWFuaWZlc3QuZGV2RmlsZXMsXG4gICAgICAgICAgICAgICAgLi4uYnVpbGRNYW5pZmVzdC5wb2x5ZmlsbEZpbGVzLFxuICAgICAgICAgICAgICAgIC4uLmJ1aWxkTWFuaWZlc3QuYW1wRGV2RmlsZXMsIFxuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIHJldHVybigvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX3JlYWN0LmRlZmF1bHQuRnJhZ21lbnQsIG51bGwsIGRpc2FibGVSdW50aW1lSlMgPyBudWxsIDogLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIsIHtcbiAgICAgICAgICAgICAgICBpZDogXCJfX05FWFRfREFUQV9fXCIsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgbm9uY2U6IHRoaXMucHJvcHMubm9uY2UsXG4gICAgICAgICAgICAgICAgY3Jvc3NPcmlnaW46IHRoaXMucHJvcHMuY3Jvc3NPcmlnaW4gfHwgcHJvY2Vzcy5lbnYuX19ORVhUX0NST1NTX09SSUdJTixcbiAgICAgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTDoge1xuICAgICAgICAgICAgICAgICAgICBfX2h0bWw6IE5leHRTY3JpcHQuZ2V0SW5saW5lU2NyaXB0U291cmNlKHRoaXMuY29udGV4dClcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiZGF0YS1hbXBkZXZtb2RlXCI6IHRydWVcbiAgICAgICAgICAgIH0pLCBhbXBEZXZGaWxlcy5tYXAoKGZpbGUpPT4vKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIiwge1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGZpbGUsXG4gICAgICAgICAgICAgICAgICAgIHNyYzogYCR7YXNzZXRQcmVmaXh9L19uZXh0LyR7ZmlsZX0ke2Rldk9ubHlDYWNoZUJ1c3RlclF1ZXJ5U3RyaW5nfWAsXG4gICAgICAgICAgICAgICAgICAgIG5vbmNlOiB0aGlzLnByb3BzLm5vbmNlLFxuICAgICAgICAgICAgICAgICAgICBjcm9zc09yaWdpbjogdGhpcy5wcm9wcy5jcm9zc09yaWdpbiB8fCBwcm9jZXNzLmVudi5fX05FWFRfQ1JPU1NfT1JJR0lOLFxuICAgICAgICAgICAgICAgICAgICBcImRhdGEtYW1wZGV2bW9kZVwiOiB0cnVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICkpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJvcHMuY3Jvc3NPcmlnaW4pIGNvbnNvbGUud2FybignV2FybmluZzogYE5leHRTY3JpcHRgIGF0dHJpYnV0ZSBgY3Jvc3NPcmlnaW5gIGlzIGRlcHJlY2F0ZWQuIGh0dHBzOi8vbmV4dGpzLm9yZy9kb2NzL21lc3NhZ2VzL2RvYy1jcm9zc29yaWdpbi1kZXByZWNhdGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmlsZXMgPSBnZXREb2N1bWVudEZpbGVzKHRoaXMuY29udGV4dC5idWlsZE1hbmlmZXN0LCB0aGlzLmNvbnRleHQuX19ORVhUX0RBVEFfXy5wYWdlLCBpbkFtcE1vZGUpO1xuICAgICAgICByZXR1cm4oLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9yZWFjdC5kZWZhdWx0LkZyYWdtZW50LCBudWxsLCAhZGlzYWJsZVJ1bnRpbWVKUyAmJiBidWlsZE1hbmlmZXN0LmRldkZpbGVzID8gYnVpbGRNYW5pZmVzdC5kZXZGaWxlcy5tYXAoKGZpbGUpPT4vKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIiwge1xuICAgICAgICAgICAgICAgIGtleTogZmlsZSxcbiAgICAgICAgICAgICAgICBzcmM6IGAke2Fzc2V0UHJlZml4fS9fbmV4dC8ke2VuY29kZVVSSShmaWxlKX0ke2Rldk9ubHlDYWNoZUJ1c3RlclF1ZXJ5U3RyaW5nfWAsXG4gICAgICAgICAgICAgICAgbm9uY2U6IHRoaXMucHJvcHMubm9uY2UsXG4gICAgICAgICAgICAgICAgY3Jvc3NPcmlnaW46IHRoaXMucHJvcHMuY3Jvc3NPcmlnaW4gfHwgcHJvY2Vzcy5lbnYuX19ORVhUX0NST1NTX09SSUdJTlxuICAgICAgICAgICAgfSlcbiAgICAgICAgKSA6IG51bGwsIGRpc2FibGVSdW50aW1lSlMgPyBudWxsIDogLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIsIHtcbiAgICAgICAgICAgIGlkOiBcIl9fTkVYVF9EQVRBX19cIixcbiAgICAgICAgICAgIHR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgbm9uY2U6IHRoaXMucHJvcHMubm9uY2UsXG4gICAgICAgICAgICBjcm9zc09yaWdpbjogdGhpcy5wcm9wcy5jcm9zc09yaWdpbiB8fCBwcm9jZXNzLmVudi5fX05FWFRfQ1JPU1NfT1JJR0lOLFxuICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6IHtcbiAgICAgICAgICAgICAgICBfX2h0bWw6IE5leHRTY3JpcHQuZ2V0SW5saW5lU2NyaXB0U291cmNlKHRoaXMuY29udGV4dClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSksIGRpc2FibGVPcHRpbWl6ZWRMb2FkaW5nICYmICFkaXNhYmxlUnVudGltZUpTICYmIHRoaXMuZ2V0UG9seWZpbGxTY3JpcHRzKCksIGRpc2FibGVPcHRpbWl6ZWRMb2FkaW5nICYmICFkaXNhYmxlUnVudGltZUpTICYmIHRoaXMuZ2V0UHJlTmV4dFNjcmlwdHMoKSwgZGlzYWJsZU9wdGltaXplZExvYWRpbmcgJiYgIWRpc2FibGVSdW50aW1lSlMgJiYgdGhpcy5nZXREeW5hbWljQ2h1bmtzKGZpbGVzKSwgZGlzYWJsZU9wdGltaXplZExvYWRpbmcgJiYgIWRpc2FibGVSdW50aW1lSlMgJiYgdGhpcy5nZXRTY3JpcHRzKGZpbGVzKSkpO1xuICAgIH1cbn1cbmV4cG9ydHMuTmV4dFNjcmlwdCA9IE5leHRTY3JpcHQ7XG5OZXh0U2NyaXB0LmNvbnRleHRUeXBlID0gX2RvY3VtZW50Q29udGV4dC5Eb2N1bWVudENvbnRleHQ7XG5OZXh0U2NyaXB0LnNhZmFyaU5vbW9kdWxlRml4ID0gJyFmdW5jdGlvbigpe3ZhciBlPWRvY3VtZW50LHQ9ZS5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO2lmKCEoXCJub01vZHVsZVwiaW4gdCkmJlwib25iZWZvcmVsb2FkXCJpbiB0KXt2YXIgbj0hMTtlLmFkZEV2ZW50TGlzdGVuZXIoXCJiZWZvcmVsb2FkXCIsZnVuY3Rpb24oZSl7aWYoZS50YXJnZXQ9PT10KW49ITA7ZWxzZSBpZighZS50YXJnZXQuaGFzQXR0cmlidXRlKFwibm9tb2R1bGVcIil8fCFuKXJldHVybjtlLnByZXZlbnREZWZhdWx0KCl9LCEwKSx0LnR5cGU9XCJtb2R1bGVcIix0LnNyYz1cIi5cIixlLmhlYWQuYXBwZW5kQ2hpbGQodCksdC5yZW1vdmUoKX19KCk7JztcbmZ1bmN0aW9uIGdldEFtcFBhdGgoYW1wUGF0aCwgYXNQYXRoKSB7XG4gICAgcmV0dXJuIGFtcFBhdGggfHwgYCR7YXNQYXRofSR7YXNQYXRoLmluY2x1ZGVzKCc/JykgPyAnJicgOiAnPyd9YW1wPTFgO1xufVxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1fZG9jdW1lbnQuanMubWFwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibmV4dC9kaXN0L3NlcnZlci9nZXQtcGFnZS1maWxlcy5qc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJuZXh0L2Rpc3Qvc2VydmVyL2h0bWxlc2NhcGUuanNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibmV4dC9kaXN0L3NlcnZlci91dGlscy5qc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJuZXh0L2Rpc3Qvc2hhcmVkL2xpYi9jb25zdGFudHMuanNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibmV4dC9kaXN0L3NoYXJlZC9saWIvZG9jdW1lbnQtY29udGV4dC5qc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJuZXh0L2Rpc3Qvc2hhcmVkL2xpYi9oZWFkLW1hbmFnZXItY29udGV4dC5qc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJuZXh0L2Rpc3Qvc2hhcmVkL2xpYi91dGlscy5qc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzdHlsZWQtanN4L3NlcnZlclwiKTsiXSwibmFtZXMiOlsiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwidmFsdWUiLCJkZWZhdWx0IiwiaW5pdEhlYWRNYW5hZ2VyIiwiRE9NQXR0cmlidXRlTmFtZXMiLCJhY2NlcHRDaGFyc2V0IiwiY2xhc3NOYW1lIiwiaHRtbEZvciIsImh0dHBFcXVpdiIsIm5vTW9kdWxlIiwicmVhY3RFbGVtZW50VG9ET00iLCJ0eXBlIiwicHJvcHMiLCJlbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInAiLCJoYXNPd25Qcm9wZXJ0eSIsInVuZGVmaW5lZCIsImF0dHIiLCJ0b0xvd2VyQ2FzZSIsInNldEF0dHJpYnV0ZSIsImNoaWxkcmVuIiwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwiLCJpbm5lckhUTUwiLCJfX2h0bWwiLCJ0ZXh0Q29udGVudCIsIkFycmF5IiwiaXNBcnJheSIsImpvaW4iLCJ1cGRhdGVFbGVtZW50cyIsImNvbXBvbmVudHMiLCJoZWFkRWwiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImhlYWRDb3VudEVsIiwicXVlcnlTZWxlY3RvciIsImNvbnNvbGUiLCJlcnJvciIsImhlYWRDb3VudCIsIk51bWJlciIsImNvbnRlbnQiLCJvbGRUYWdzIiwiaSIsImoiLCJwcmV2aW91c0VsZW1lbnRTaWJsaW5nIiwidGFnTmFtZSIsInB1c2giLCJuZXdUYWdzIiwibWFwIiwiZmlsdGVyIiwibmV3VGFnIiwiayIsImxlbiIsImxlbmd0aCIsIm9sZFRhZyIsImlzRXF1YWxOb2RlIiwic3BsaWNlIiwiZm9yRWFjaCIsInQiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJpbnNlcnRCZWZvcmUiLCJ0b1N0cmluZyIsInVwZGF0ZVByb21pc2UiLCJtb3VudGVkSW5zdGFuY2VzIiwiU2V0IiwidXBkYXRlSGVhZCIsImhlYWQiLCJwcm9taXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0aGVuIiwidGFncyIsImgiLCJocmVmIiwidGl0bGVDb21wb25lbnQiLCJ0aXRsZSIsInJlcXVlc3RJZGxlQ2FsbGJhY2siLCJjYW5jZWxJZGxlQ2FsbGJhY2siLCJzZWxmIiwiYmluZCIsIndpbmRvdyIsImNiIiwic3RhcnQiLCJEYXRlIiwibm93Iiwic2V0VGltZW91dCIsImRpZFRpbWVvdXQiLCJ0aW1lUmVtYWluaW5nIiwiTWF0aCIsIm1heCIsImlkIiwiY2xlYXJUaW1lb3V0IiwiaW5pdFNjcmlwdExvYWRlciIsIl9yZWFjdCIsInJlcXVpcmUiLCJfaGVhZE1hbmFnZXJDb250ZXh0IiwiX2hlYWRNYW5hZ2VyIiwiX3JlcXVlc3RJZGxlQ2FsbGJhY2siLCJfZGVmaW5lUHJvcGVydHkiLCJvYmoiLCJrZXkiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJfb2JqZWN0U3ByZWFkIiwidGFyZ2V0IiwiYXJndW1lbnRzIiwic291cmNlIiwib3duS2V5cyIsImtleXMiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJjb25jYXQiLCJzeW0iLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMiLCJleGNsdWRlZCIsIl9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlIiwic291cmNlU3ltYm9sS2V5cyIsImluZGV4T2YiLCJwcm90b3R5cGUiLCJwcm9wZXJ0eUlzRW51bWVyYWJsZSIsImNhbGwiLCJzb3VyY2VLZXlzIiwiU2NyaXB0Q2FjaGUiLCJNYXAiLCJMb2FkQ2FjaGUiLCJpZ25vcmVQcm9wcyIsImxvYWRTY3JpcHQiLCJzcmMiLCJvbkxvYWQiLCJvbkVycm9yIiwiY2FjaGVLZXkiLCJoYXMiLCJhZGQiLCJnZXQiLCJsb2FkUHJvbWlzZSIsInJlamVjdCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiY2F0Y2giLCJzZXQiLCJlbnRyaWVzIiwiaW5jbHVkZXMiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJoYW5kbGVDbGllbnRTY3JpcHRMb2FkIiwic3RyYXRlZ3kiLCJsb2FkTGF6eVNjcmlwdCIsInJlYWR5U3RhdGUiLCJzY3JpcHRMb2FkZXJJdGVtcyIsIlNjcmlwdCIsInJlc3RQcm9wcyIsInVwZGF0ZVNjcmlwdHMiLCJzY3JpcHRzIiwidXNlQ29udGV4dCIsIkhlYWRNYW5hZ2VyQ29udGV4dCIsInVzZUVmZmVjdCIsImJlZm9yZUludGVyYWN0aXZlIiwiX2RlZmF1bHQiLCJfdXRpbHMiLCJEb2N1bWVudENvbnRleHQiLCJEb2N1bWVudEluaXRpYWxQcm9wcyIsIkRvY3VtZW50UHJvcHMiLCJIdG1sIiwiTWFpbiIsIl9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkIiwiX3NlcnZlciIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJfY29uc3RhbnRzIiwiX2RvY3VtZW50Q29udGV4dCIsIl9nZXRQYWdlRmlsZXMiLCJfdXRpbHMxIiwiX2h0bWxlc2NhcGUiLCJfc2NyaXB0IiwiX19lc01vZHVsZSIsIm5ld09iaiIsImRlc2MiLCJnZXREb2N1bWVudEZpbGVzIiwiYnVpbGRNYW5pZmVzdCIsInBhdGhuYW1lIiwiaW5BbXBNb2RlIiwic2hhcmVkRmlsZXMiLCJnZXRQYWdlRmlsZXMiLCJwYWdlRmlsZXMiLCJhbGxGaWxlcyIsImdldFBvbHlmaWxsU2NyaXB0cyIsImNvbnRleHQiLCJhc3NldFByZWZpeCIsImRldk9ubHlDYWNoZUJ1c3RlclF1ZXJ5U3RyaW5nIiwiZGlzYWJsZU9wdGltaXplZExvYWRpbmciLCJwb2x5ZmlsbEZpbGVzIiwicG9seWZpbGwiLCJlbmRzV2l0aCIsImRlZmVyIiwibm9uY2UiLCJjcm9zc09yaWdpbiIsInByb2Nlc3MiLCJlbnYiLCJfX05FWFRfQ1JPU1NfT1JJR0lOIiwiZ2V0UHJlTmV4dFNjcmlwdHMiLCJzY3JpcHRMb2FkZXIiLCJmaWxlIiwiaW5kZXgiLCJzY3JpcHRQcm9wcyIsImFzc2lnbiIsImdldER5bmFtaWNDaHVua3MiLCJmaWxlcyIsImR5bmFtaWNJbXBvcnRzIiwiaXNEZXZlbG9wbWVudCIsImFzeW5jIiwiZW5jb2RlVVJJIiwiZ2V0U2NyaXB0cyIsInJlZiIsIm5vcm1hbFNjcmlwdHMiLCJsb3dQcmlvcml0eVNjcmlwdHMiLCJsb3dQcmlvcml0eUZpbGVzIiwiRG9jdW1lbnQxIiwiQ29tcG9uZW50IiwiZ2V0SW5pdGlhbFByb3BzIiwiY3R4IiwiZW5oYW5jZUFwcCIsIkFwcCIsImh0bWwiLCJyZW5kZXJQYWdlIiwic3R5bGVzIiwicmVuZGVyRG9jdW1lbnQiLCJEb2N1bWVudENvbXBvbmVudCIsIlByb3ZpZGVyIiwicmVuZGVyIiwiSGVhZCIsIk5leHRTY3JpcHQiLCJkb2NDb21wb25lbnRzUmVuZGVyZWQiLCJsb2NhbGUiLCJsYW5nIiwiYW1wIiwiZ2V0Q3NzTGlua3MiLCJjc3NGaWxlcyIsImYiLCJ1bm1hbmdlZEZpbGVzIiwiZHluYW1pY0Nzc0ZpbGVzIiwiZnJvbSIsImV4aXN0aW5nIiwiY3NzTGlua0VsZW1lbnRzIiwiaXNTaGFyZWRGaWxlIiwiX19ORVhUX09QVElNSVpFX0NTUyIsInJlbCIsImFzIiwiaXNVbm1hbmFnZWRGaWxlIiwiX19ORVhUX09QVElNSVpFX0ZPTlRTIiwibWFrZVN0eWxlc2hlZXRJbmVydCIsImdldFByZWxvYWREeW5hbWljQ2h1bmtzIiwiQm9vbGVhbiIsImdldFByZWxvYWRNYWluTGlua3MiLCJwcmVsb2FkRmlsZXMiLCJoYW5kbGVEb2N1bWVudFNjcmlwdExvYWRlckl0ZW1zIiwiZmlsdGVyZWRDaGlsZHJlbiIsIkNoaWxkcmVuIiwiY2hpbGQiLCJfX05FWFRfREFUQV9fIiwibm9kZSIsImMiLCJPUFRJTUlaRURfRk9OVF9QUk9WSURFUlMiLCJzb21lIiwidXJsIiwic3RhcnRzV2l0aCIsIm5ld1Byb3BzIiwiY2xvbmVFbGVtZW50IiwiYW1wUGF0aCIsImh5YnJpZEFtcCIsImNhbm9uaWNhbEJhc2UiLCJkYW5nZXJvdXNBc1BhdGgiLCJoZWFkVGFncyIsInVuc3RhYmxlX3J1bnRpbWVKUyIsInVuc3RhYmxlX0pzUHJlbG9hZCIsImRpc2FibGVSdW50aW1lSlMiLCJkaXNhYmxlSnNQcmVsb2FkIiwiY3NzUHJlbG9hZHMiLCJvdGhlckhlYWRFbGVtZW50cyIsInRvQXJyYXkiLCJpc1JlYWN0SGVsbWV0IiwicmVmMSIsIndhcm4iLCJuYW1lIiwiaGFzQW1waHRtbFJlbCIsImhhc0Nhbm9uaWNhbFJlbCIsImJhZFByb3AiLCJwcm9wIiwicGFnZSIsImN1clN0eWxlcyIsImhhc1N0eWxlcyIsInJlZjIiLCJyZWYzIiwiX25vbmNlIiwiX25vbmNlMSIsIkZyYWdtZW50IiwiY291bnQiLCJjbGVhbkFtcFBhdGgiLCJzdHlsZSIsInJlcGxhY2UiLCJnZXRBbXBQYXRoIiwiX19ORVhUX09QVElNSVpFX0lNQUdFUyIsImNvbnRleHRUeXBlIiwiQU1QX1JFTkRFUl9UQVJHRVQiLCJnZXRJbmxpbmVTY3JpcHRTb3VyY2UiLCJkb2N1bWVudFByb3BzIiwiZGF0YSIsIkpTT04iLCJzdHJpbmdpZnkiLCJodG1sRXNjYXBlSnNvblN0cmluZyIsImVyciIsIm1lc3NhZ2UiLCJFcnJvciIsImFtcERldkZpbGVzIiwiZGV2RmlsZXMiLCJzYWZhcmlOb21vZHVsZUZpeCIsImFzUGF0aCJdLCJzb3VyY2VSb290IjoiIn0=