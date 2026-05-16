import "dotenv/config";
import express from "express"
import indexRouter from "./routes/indexRoute.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.use('/', indexRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});