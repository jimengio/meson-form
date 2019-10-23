import { routerRules } from "models/router-rules";
import { generateTree } from "@jimengio/router-code-generator";

import * as fs from "fs";
import * as path from "path";
import * as prettier from "prettier";

let filePath = path.join(process.env.PWD, "example/controller/generated-router.ts");
let prettierConfigs = JSON.parse(fs.readFileSync(path.join(process.env.PWD, ".prettierrc"), "utf8"));
prettierConfigs.parser = "typescript";

let originalFile = fs.readFileSync(filePath, "utf8");
let separator = "\n// generated\n";

let pieces = originalFile.split(separator);
let routerCode = generateTree(routerRules, { addVersion: true, addTypes: true });

console.assert(pieces.length === 2, "supposed to be splitted by separator");

pieces = [pieces[0], "\n" + routerCode];

let content = pieces.join(separator);
let formatted = prettier.format(content, prettierConfigs);

fs.writeFileSync(filePath, formatted);
console.log("Wrote to", path.relative(process.env.PWD, filePath));
