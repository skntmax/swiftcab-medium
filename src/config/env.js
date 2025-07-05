"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const env = {
    PORT: process.env.PORT,
    VERSION: process.env.VERSION,
    SECRET_KEY: process.env.SECRET_KEY
};
exports.env = env;
Object.freeze(env);
