"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vueRouter = require("vue-router");

var _Dashboard = _interopRequireDefault(require("@/pages/Dashboard.vue"));

var _Index = _interopRequireDefault(require("@/pages/Index.vue"));

var _Markers = _interopRequireDefault(require("@/pages/Markers.vue"));

var _Shapes = _interopRequireDefault(require("@/pages/Shapes.vue"));

var _Upload = _interopRequireDefault(require("@/pages/Upload.vue"));

var _Login = _interopRequireDefault(require("@/components/Auth/Login.vue"));

var _Signup = _interopRequireDefault(require("@/components/Auth/Signup.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var routes = [{
  path: '/',
  name: 'Index',
  component: _Index["default"]
}, {
  path: '/login',
  name: 'Login',
  component: _Login["default"]
}, {
  path: '/signup',
  name: 'Signup',
  component: _Signup["default"]
}, {
  path: '/dashboard',
  name: 'Dashboard',
  component: _Dashboard["default"]
}, {
  path: '/markers',
  name: 'Markers',
  component: _Markers["default"]
}, {
  path: '/shapes',
  name: 'Shapes',
  component: _Shapes["default"]
}, {
  path: '/upload',
  name: 'Upload',
  component: _Upload["default"]
}];
var router = (0, _vueRouter.createRouter)({
  history: (0, _vueRouter.createWebHashHistory)(),
  // Add this line
  mode: 'history',
  // Use HTML5 history mode (no hashbang in URLs)
  base: process.env.BASE_URL,
  routes: routes
});
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=index.dev.js.map
