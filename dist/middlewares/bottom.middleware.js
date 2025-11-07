"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = require("http-errors");
class BottomMiddleware {
    constructor(app) {
        app.use(this.routeNotFoundErrorHandler);
        app.use(this.fromRouteErrorHandler);
    }
    routeNotFoundErrorHandler(req, res, next) {
        next(new http_errors_1.NotFound("No route found, Please check your urls."));
    }
    fromRouteErrorHandler(err, req, res, next) {
        res.status(err.status || 500);
        const errorMessage = err.errors
            ? Object.entries(err.errors)
                .map((error) => error[1].message)
                .join()
            : err.message?.includes("duplicate")
                ? `${Object.entries(err.keyValue)[0][0]
                    .toString()
                    .split(/(?=[A-Z])/)
                    .join(" ")
                    .split(".")
                    .join(" ")
                    .replace(/^\w/, (c) => c.toUpperCase())} is already exist!`
                : err?.message || err?.error?.description || "Something went wrong";
        res.json({
            error: {
                message: errorMessage,
            },
        });
    }
}
//
exports.default = BottomMiddleware;
//# sourceMappingURL=bottom.middleware.js.map