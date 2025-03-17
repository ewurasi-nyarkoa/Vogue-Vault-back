import fs from "fs";

const gitignoreContent = `.env
node_modules
uploads
`;

fs.writeFileSync(".gitignore", gitignoreContent, "utf8");

console.log("✅ .gitignore file created successfully!");
