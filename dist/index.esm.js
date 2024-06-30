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
  if (object.data) {
    const entries = [];
    for (let entry of object.data.entries()) {
      entries.push(entry);
    }
    entries.sort((a, b) => a[0].localeCompare(b[0]));
    object.data = await entriesToString(entries);
  }
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
async function entriesToString(entries) {
  const parts = [];
  for (let [key, value] of entries) {
    if (value instanceof File) {
      const fileContent = await fileToBase64(value);
      parts.push(`${key}=${fileContent}`);
    } else {
      parts.push(`${key}=${value}`);
    }
  }
  return parts.join("&");
}
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
  constructor(message, code = null, info = null) {
    super(message);
    this.name = "ServerRespondError";
    this.code = code;
    this.info = info;
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

// src/Errors/EmulateRequestMissingError.js
var EmulateRequestMissingError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "EmulateRequestMissingError";
  }
};

// src/Emulator.js
var Emulator = class {
  _emulated_requests = {};
  constructor() {
  }
  add(user_action, request_options, response_data) {
    let _request_fingerprint = void 0;
    try {
      this._options = resolveOptions_default(user_action, request_options);
    } catch (Error2) {
      console.error(Error2);
    } finally {
      getObjectFingerprint(request_options).then(
        (fingerprint) => {
          this._emulated_requests[fingerprint] = response_data;
          _request_fingerprint = fingerprint;
        }
      );
    }
    return _request_fingerprint;
  }
  get(fingerprinting) {
    if (!this._emulated_requests.hasOwnProperty(fingerprinting)) throw new EmulateRequestMissingError(`There is no request with this fingerprint`);
    return this._emulated_requests[fingerprinting];
  }
};

// src/Errors/RequestError.js
var RequestError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "RequestError";
  }
};

// src/UserAction.js
var UserAction = class {
  _options = {};
  _last_request_fingerprint = null;
  Emulator = void 0;
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
            if (this.Emulator) this._emulateRequest();
            else this._request();
          } else console.warn(new RepeatedRequestError(`The same request ("${action}") is sent repeatedly`));
        }
      );
    }
  }
  enableEmulation() {
    this.Emulator = new Emulator();
  }
  _request() {
    fetch(this._options.url ?? window.location.href, {
      method: "POST",
      body: this._options.data
    }).then(this._handleResponse.bind(this)).then(this._handleData.bind(this)).catch(this._handleError.bind(this));
  }
  _emulateRequest() {
    new Promise((resolve) => {
      resolve(this.Emulator.get(this._last_request_fingerprint));
    }).then(this._handleData.bind(this)).catch(this._handleError.bind(this));
  }
  _handleResponse(response) {
    if (!response.ok) throw new RequestError(`${response.status} ${response.statusText}`);
    return response.json();
  }
  _handleData(response_data) {
    if (!response_data.status) throw new ServerRespondError(response_data.result.msg, response_data.result.code, response_data.result.info);
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
export {
  js_user_action_default as default
};
