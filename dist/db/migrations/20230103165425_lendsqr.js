"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema
            .createTable("users", (table) => {
            table.increments("id").primary();
            table.string("full_name").notNullable;
            table.string("email").notNullable().unique();
            table.string("password").notNullable();
            table.string("token").nullable();
            table.integer("wallet_balance").defaultTo(0);
            table.timestamps(true, true);
        })
            .createTable("wallets", (table) => {
            table.increments("id").primary();
            table.integer("wallet_number").unique();
            table.string("user_email").notNullable().unique();
            table.integer("amount").defaultTo(0);
            table.timestamps(true, true);
        })
            .createTable("transactions_history", (table) => {
            table.increments("id").primary();
            table.string("sender").notNullable();
            table.string("action").notNullable();
            table.integer("amount").notNullable();
            table.string("receiver").nullable();
            table.timestamps(true, true);
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema
            .dropTable("users")
            .dropTable("wallets")
            .dropTable("transactions_history");
    });
}
exports.down = down;
