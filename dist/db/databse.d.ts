import mongoose from "mongoose";
declare global {
    var mongoose: any;
}
declare class DataBase {
    private static uri;
    static connect(): Promise<typeof mongoose | undefined>;
    static disConnect(): Promise<void>;
}
declare const DB: typeof DataBase;
export default DB;
//# sourceMappingURL=databse.d.ts.map