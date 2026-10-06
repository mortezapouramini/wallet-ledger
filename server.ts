import dotenv from "dotenv"
dotenv.config({ path: ".env" });
import { app } from "./index";

const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
