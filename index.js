import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import pg from "pg";
import env from "dotenv"
import path from "path";
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const app = express();
const port= 5000;
env.config();

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    ssl:true
  });
db.connect();


app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));


app.post("/message", async (req, res) => {
    const message = req.body
    console.log(message)
    await db.query("INSERT INTO messages (message) VALUES ($1)",
    [message])
}
)

 //Handle all other routes by serving the React app
 app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

app.listen(port, () => {
    console.log("Server is running on port "+ port);
})



