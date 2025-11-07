"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptAndDecryptService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class EncryptAndDecryptService {
    async hashPassword(password) {
        const salt = await bcryptjs_1.default.genSalt(10);
        return bcryptjs_1.default.hash(password, salt);
    }
    async comparePassword(password, hash) {
        return bcryptjs_1.default.compare(password, hash);
    }
}
exports.EncryptAndDecryptService = EncryptAndDecryptService;
//# sourceMappingURL=encrtiption.service.js.map