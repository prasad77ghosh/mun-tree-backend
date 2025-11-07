"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const databse_1 = __importDefault(require("../db/databse"));
const user_model_1 = __importDefault(require("../model/user.model"));
const node_model_1 = require("../model/node.model");
/* -------------------- Helper Functions -------------------- */
function computeResult(left, op, right) {
    if (!op || right === null)
        return left;
    switch (op) {
        case "+": return left + right;
        case "-": return left - right;
        case "*": return left * right;
        case "/": return right === 0 ? left : left / right;
        default: return left;
    }
}
function randomOperation() {
    const ops = ["+", "-", "*", "/"];
    return ops[Math.floor(Math.random() * ops.length)];
}
/* -------------------- Main Seeder -------------------- */
async function seedData() {
    try {
        // ✅ Connect to MongoDB
        await databse_1.default.connect();
        console.log("🧹 Clearing old data and resetting indexes...");
        await Promise.all([user_model_1.default.deleteMany({}), node_model_1.NodeSchema.deleteMany({})]);
        // ✅ Drop all old indexes (especially 'username_1')
        await user_model_1.default.collection.dropIndexes().catch(() => { });
        await user_model_1.default.syncIndexes();
        console.log("🔧 User indexes synced successfully.");
        console.log("👥 Creating 3 users...");
        const plainPasswords = ["password123", "secret123", "admin123"];
        const users = [
            {
                name: "user_one",
                email: "user1@example.com",
                password: bcryptjs_1.default.hashSync(plainPasswords[0], 10),
                role: "user",
            },
            {
                name: "user_two",
                email: "user2@example.com",
                password: bcryptjs_1.default.hashSync(plainPasswords[1], 10),
                role: "user",
            },
            {
                name: "user_three",
                email: "user3@example.com",
                password: bcryptjs_1.default.hashSync(plainPasswords[2], 10),
                role: "user",
            },
        ];
        const insertedUsers = await user_model_1.default.insertMany(users, { ordered: true });
        const userIds = insertedUsers.map((u) => u._id);
        console.log(`✅ ${insertedUsers.length} users created`);
        console.log("🧾 Sample User Credentials:");
        insertedUsers.forEach((u, i) => {
            console.log({
                name: u.name,
                email: u.email,
                password: plainPasswords[i],
            });
        });
        console.log("🌳 Creating 1000 root nodes...");
        const roots = [];
        for (let i = 0; i < 1000; i++) {
            const authorId = faker_1.faker.helpers.arrayElement(userIds);
            const startValue = faker_1.faker.number.int({ min: 1, max: 100 });
            roots.push({
                parentId: null,
                rootId: new mongoose_1.Types.ObjectId(),
                authorId,
                leftValue: startValue,
                operation: null,
                rightValue: null,
                result: startValue,
            });
        }
        const insertedRoots = await node_model_1.NodeSchema.insertMany(roots);
        // ✅ Fix rootId = _id for each root
        const bulkOps = insertedRoots.map((root) => ({
            updateOne: {
                filter: { _id: root._id },
                update: { rootId: root._id },
            },
        }));
        await node_model_1.NodeSchema.bulkWrite(bulkOps);
        console.log(`✅ ${insertedRoots.length} roots inserted. Creating replies...`);
        /* -------------------- Replies (3 Levels Deep) -------------------- */
        for (const root of insertedRoots) {
            // LEVEL 1
            const level1Nodes = [];
            for (let i = 0; i < 3; i++) {
                const op = randomOperation();
                const right = faker_1.faker.number.int({ min: 1, max: 10 });
                const result = computeResult(root.result, op, right);
                level1Nodes.push({
                    rootId: root._id,
                    parentId: root._id,
                    authorId: faker_1.faker.helpers.arrayElement(userIds),
                    leftValue: root.result,
                    operation: op,
                    rightValue: right,
                    result,
                });
            }
            const level1 = await node_model_1.NodeSchema.insertMany(level1Nodes);
            // LEVEL 2
            const level2Nodes = [];
            for (const parent of level1) {
                for (let i = 0; i < 2; i++) {
                    const op = randomOperation();
                    const right = faker_1.faker.number.int({ min: 1, max: 10 });
                    const result = computeResult(parent.result, op, right);
                    level2Nodes.push({
                        rootId: root._id,
                        parentId: parent._id,
                        authorId: faker_1.faker.helpers.arrayElement(userIds),
                        leftValue: parent.result,
                        operation: op,
                        rightValue: right,
                        result,
                    });
                }
            }
            const level2 = await node_model_1.NodeSchema.insertMany(level2Nodes);
            // LEVEL 3
            const level3Nodes = [];
            for (const parent of level2) {
                const op = randomOperation();
                const right = faker_1.faker.number.int({ min: 1, max: 10 });
                const result = computeResult(parent.result, op, right);
                level3Nodes.push({
                    rootId: root._id,
                    parentId: parent._id,
                    authorId: faker_1.faker.helpers.arrayElement(userIds),
                    leftValue: parent.result,
                    operation: op,
                    rightValue: right,
                    result,
                });
            }
            await node_model_1.NodeSchema.insertMany(level3Nodes);
        }
        console.log("✅ Seeding completed successfully!");
    }
    catch (error) {
        console.error("❌ Error seeding database:", error);
    }
    finally {
        console.log("🔌 Disconnecting DB...");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        databse_1.default.disConnect();
    }
}
seedData();
//# sourceMappingURL=seed-data.js.map