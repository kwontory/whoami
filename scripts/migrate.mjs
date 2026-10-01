import { readFileSync } from "node:fs";
import { connect } from "./db.mjs";

const sql = connect();
const schema = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");
for (const statement of schema.split(";").map((part) => part.trim()).filter(Boolean)) {
  await sql.query(statement);
}
await sql.end();
console.log("Schema ready");
