var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var UAMError = class _UAMError extends Error {
  static COMMON_ERROR_CODE = "SOMETHING_WENT_WRONG";
  constructor(msg = "", info = { code: _UAMError.COMMON_ERROR_CODE }, SystemError = void 0) {
    super(msg);
    this.info = typeof info === "string" ? { code: info } : info;
    this.SystemError = SystemError;
  }
};
var UserAction = class {
  _options = {};
  _last_data = null;
  _is_debugging = false;
  _is_emulating = false;
  _is_request_blocking = false;
  constructor() {
    this._is_debugging = Boolean(-1 < w.location.href.indexOf("_ng_debug"));
  }
  request(options = {}) {
    this._is_request_blocking = false;
    this._resolveOptions(options);
    if (!this._is_request_blocking) {
      this._printDebugMsg(`request data for user action "${this._options.FormData.get("user_action")}"`, this._options);
      if (!this._is_emulating) {
        fetch(this._options.url, {
          method: "POST",
          body: this._options.FormData
        }).then(this._handleResponse.bind(this)).then(this._handleResponseData.bind(this)).catch(this._handleResponseError.bind(this));
      } else this._handleResponseData(this._options.emulation(options));
    }
  }
  //todo: мб сделать через OptionResolver
  _resolveOptions(options) {
    this._options.FormData = this._resolveDataOption(options.data);
    this._options.handlers = this._resolveHandlersOption(options.handlers);
    this._options.url = this._resolveURLOption(options.url);
    this._options.emulation = this._resolveEmulationOption(options.emulation);
  }
  _resolveDataOption(data) {
    if (typeof data === "object") {
      if (Object.prototype.toString.call(data) !== "[object FormData]") {
        let form_data = new FormData();
        for (let [key, value] of Object.entries(data)) {
          form_data.append(key, value);
        }
        data = form_data;
      }
      let user_action = data.get("user_action");
      if (!user_action || user_action === "undefined" || typeof user_action !== "string") this._printErrorMsg('"Data" option must contain "user_action" parameter, of type string.');
    } else this._printErrorMsg("Data option must be a object.", data);
    return data;
  }
  _resolveHandlersOption(handlers) {
    if (typeof handlers !== "object") {
      handlers = {};
    }
    if (!handlers.success && typeof handlers.success !== "function") {
      handlers.success = (d) => {
        console.log("UAM: default success handler", d);
      };
    }
    if (!handlers.error && typeof handlers.error !== "function") {
      handlers.error = (d) => {
        console.log("UAM: default error handler", d);
      };
    }
    return handlers;
  }
  _resolveURLOption(url) {
    url = url ?? window.location.href;
    if (typeof url !== "string") this._printErrorMsg('"URL" option must be string type.');
    return url;
  }
  _resolveEmulationOption(emulation) {
    if (emulation && typeof emulation !== "function") this._printErrorMsg('"Emulation" option must be type of function.');
    return emulation;
  }
  _handleResponse(response) {
    if (!response.ok) throw new UAMError(`${response.status} ${response.statusText}`);
    return response.json();
  }
  _handleResponseData(response_data) {
    if (!response_data.status) throw new UAMError("", response_data.result);
    this._printDebugMsg("request result is", response_data.result);
    this._options.handlers.success(response_data.result);
  }
  _handleResponseError(Error2) {
    if (!Boolean(Error2 instanceof UAMError)) Error2 = new UAMError(void 0, void 0, Error2);
    this._printDebugMsg("an error occurred", Error2);
    this._options.handlers.error(Error2);
  }
  _printDebugMsg(msg, data = void 0) {
    if (this._is_debugging) console.log("UAM: " + msg, data);
  }
  _printErrorMsg(msg, data = void 0) {
    this._is_request_blocking = true;
    console.warn("UAM: " + msg, data);
  }
};
var src_default = UserAction;
