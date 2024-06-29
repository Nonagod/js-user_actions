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

// index.js
var js_user_action_exports = {};
__export(js_user_action_exports, {
  default: () => js_user_action_default
});
module.exports = __toCommonJS(js_user_action_exports);

// src/Errors/OptionResolvingError.js
var OptionResolvingError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "OptionResolvingError";
  }
};

// src/Errors/UnknownOptionError.js
var UnknownOptionError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "UnknownOptionError";
  }
};

// src/resolveOptions.js
function resolveOptions(user_action, options) {
  if (!user_action || user_action === "undefined" || typeof user_action !== "string")
    throw new OptionResolvingError(`Parameter "action" is required and must be a string`);
  if (typeof options !== "object")
    throw new OptionResolvingError(`Parameter "options" must be an object`);
  for (let [name, value] of Object.entries(options)) {
    switch (name) {
      case "data":
        if (typeof value !== "object") throw new OptionResolvingError(`Option "data" must be an object (including FormData)`);
        break;
      case "url":
        if (typeof value !== "string") throw new OptionResolvingError(`Option "url" must be valid URL (string)`);
        break;
      case "handleSuccess":
        if (typeof value !== "function") throw new OptionResolvingError(`Option "handleSuccess" must be an function`);
        break;
      case "handleError":
        if (typeof value !== "function") throw new OptionResolvingError(`Option "handleError" must be an function`);
        break;
      default:
        console.warn(new UnknownOptionError(`Option "${name}" is not used`));
    }
  }
  if (options.hasOwnProperty("data")) {
    if (Object.prototype.toString.call(options.data) !== "[object FormData]") {
      let form_data = new FormData();
      for (let [key, value] of Object.entries(options.data)) {
        form_data.append(key, value);
      }
      options.data = form_data;
    }
  } else {
    options.data = new FormData();
  }
  options.data.append("user_action", user_action);
  return options;
}
var resolveOptions_default = resolveOptions;

// src/getObjectFingerprint.js
async function getObjectFingerprint(object) {
  let fingerprint = getSortedString(object);
  fingerprint = new TextEncoder().encode(fingerprint);
  fingerprint = await crypto.subtle.digest("SHA-256", fingerprint);
  fingerprint = Array.from(new Uint8Array(fingerprint)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return fingerprint;
}
function getSortedString(object) {
  let keys = Object.keys(object).sort(), sorted_object = {};
  keys.forEach((key) => {
    sorted_object[key] = object[key];
  });
  return JSON.stringify(sorted_object);
}

// src/Errors/RepeatedRequestError.js
var RepeatedRequestError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "RepeatedRequestError";
  }
};

// src/Handlers/handleSuccessDefault.js
function handleSuccessDefault(data) {
  console.log("Response data is: ", data);
}

// src/Handlers/handleErrorDefault.js
function handleErrorDefault(Error2) {
  console.error(Error2);
}

// src/Errors/ServerRespondError.js
var ServerRespondError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ServerRespondError";
  }
};

// src/Errors/SomethingWentWrongError.js
var SomethingWentWrongError = class extends Error {
  constructor(OriginalError = void 0, message = void 0) {
    message = message ?? "Something went wrong, try again later or contact to administrator";
    super(message);
    this.name = "SomethingWentWrongError";
    if (OriginalError) {
      this.originalError = OriginalError;
      this.stack = `${this.stack}
Caused by: ${OriginalError.stack}`;
    }
  }
};

// src/UserAction.js
var UserAction = class {
  _options = {};
  _last_request_fingerprint = null;
  handleSuccessDefault = handleSuccessDefault;
  handleErrorDefault = handleErrorDefault;
  constructor() {
  }
  do(action, options = {}) {
    try {
      this._options = resolveOptions_default(action, options);
    } catch (Error2) {
      console.error(Error2);
    } finally {
      getObjectFingerprint(this._options).then(
        (fingerprint) => {
          if (fingerprint !== this._last_request_fingerprint) {
            this._last_request_fingerprint = fingerprint;
            this._request();
          } else console.warn(new RepeatedRequestError(`The same request ("${action}") is sent repeatedly`));
        }
      );
    }
  }
  async _request() {
    let some = await fetch(this._options.url ?? window.location.href, {
      // ошибки самого fetch (уровня POST, CORS, net::) не отлавливаются, даже если обернуть еще в одно try...catch
      method: "POST",
      body: this._options.data
    });
    console.log(some);
    fetch(this._options.url ?? window.location.href, {
      // ошибки самого fetch (уровня POST, CORS, net::) не отлавливаются, даже если обернуть еще в одно try...catch
      method: "POST",
      body: this._options.data
    }).then(this._handleResponse.bind(this)).then(this._handleData.bind(this)).catch(this._handleError.bind(this));
  }
  // ToDo: Перевести под адаптированую концепцию под код ответа
  _handleResponse(response) {
    console.log(response);
    if (!response.ok) throw new UAMError(`${response.status} ${response.statusText}`);
    return response.json();
  }
  _handleData(response_data) {
    console.log(response_data);
    if (!response_data.status) throw new ServerRespondError("", response_data.result);
    (this._options.handleSuccess ?? this.handleSuccessDefault)(response_data.result);
  }
  _handleError(Error2) {
    if (!Boolean(Error2 instanceof ServerRespondError)) Error2 = new SomethingWentWrongError(Error2);
    (this._options.handleError ?? this.handleErrorDefault)(Error2);
  }
};
var UserAction_default = UserAction;

// index.js
var js_user_action_default = UserAction_default;
