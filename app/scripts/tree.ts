import fs from "fs";
import path from "path";

function walk(dir: string, prefix = "") {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        if (["node_modules", ".next", ".git"].includes(file.name)) continue;
        console.log(prefix + "├── " + file.name);
        if (file.isDirectory()) {
            walk(path.join(dir, file.name), prefix + "│   ");
        }
    }
}

walk(".");
