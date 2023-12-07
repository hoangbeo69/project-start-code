import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const port = process.env.PORT || 8082;
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}");
});

app.get("/filteredimage", async (req, res, next) => {
  let imageUrl = req.query?.["image_url"];
  if (!imageUrl) {
    res.status(400);
    res.send("image_url is invalid please try again!!!");
    return;
  }

  let imgPath = await filterImageFromURL(imageUrl);

  res.sendFile(imgPath, {}, (err) => {
    if (err) {
      next(err);
    } else {
      deleteLocalFiles([imgPath]);
      next();
    }
  });
});

app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});