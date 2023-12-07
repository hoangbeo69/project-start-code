import fs from "fs";
import Jimp from "jimp";
import { fileURLToPath } from "url";
import { dirname, join, normalize } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function filterImageFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(inputURL);
      const rawImgFile = await response.arrayBuffer();
      const photo = await Jimp.read(rawImgFile);
      const outpath = `${join(__dirname)}${normalize(
        "/tmp/filtered"
      )}-${Math.floor(Math.random() * 2000)}.jpg`;
      await photo
        .resize(256, 256) 
        .quality(60) 
        .greyscale() 
        .write(outpath, (img) => {
          resolve(outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}
export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}