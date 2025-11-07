"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyOperation = void 0;
const applyOperation = (left, operation, right) => {
    switch (operation) {
        case "+": return left + right;
        case "-": return left - right;
        case "*": return left * right;
        case "/":
            if (right === 0)
                throw new Error("Division by zero");
            return left / right;
        default:
            throw new Error(`Unsupported operation: ${operation}`);
    }
};
exports.applyOperation = applyOperation;
//# sourceMappingURL=node.helper.js.map