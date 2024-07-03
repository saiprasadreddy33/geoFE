"use strict";

module.exports = {
  // Your existing ESLint configuration
  parserOptions: {
    requireConfigFile: false,
    // Disable config file checking
    babelOptions: {
      presets: ['@babel/preset-env']
    }
  },
  plugins: ['babel'],
  "extends": ['eslint:recommended', 'plugin:babel/recommended' // Use the recommended rules from eslint-plugin-babel
  // Other ESLint configurations you may have
  ],
  rules: {// Any additional rules you want to configure
  }
};
//# sourceMappingURL=eslintrc.dev.js.map
