"use strict";

var _vue = require("vue");

var _App = _interopRequireDefault(require("./App.vue"));

var _router = _interopRequireDefault(require("./router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Import Vue Router instance
var app = (0, _vue.createApp)(_App["default"]);
app.use(_router["default"]);
app.mount('#app');
//# sourceMappingURL=main.dev.js.map
