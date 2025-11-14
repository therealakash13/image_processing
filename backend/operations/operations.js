import sharp from "sharp";
import fs from "fs/promises";

async function grayScale(inputPath, outputPath) {
  try {
    const res = await sharp(inputPath).grayscale().toFile(outputPath); // image processing
    if (!res) throw new Error("Error while processing image."); // error while processing
    await fs.unlink(inputPath); // delete original if success

    return res;
  } catch (error) {
    console.log("Grayscale error : ", { error });
    throw error;
  }
}

async function rotateImage(inputPath, outputPath, deg) {
  try {
    const res = await sharp(inputPath).rotate(deg).toFile(outputPath);
    if (!res) throw new Error("Error while processing image."); // error while processing
    await fs.unlink(inputPath); // delete original if success

    return res;
  } catch (error) {
    console.log("Rotate error : ", { error });
    throw error;
  }
}

async function blurImage(inputPath, outputPath, perc) {
  try {
    const res = await sharp(inputPath).blur(perc).toFile(outputPath);
    if (!res) throw new Error("Error while processing image."); // error while processing
    await fs.unlink(inputPath); // delete original if success

    return res;
  } catch (error) {
    console.log("Blur error : ", { error });
    throw error;
  }
}

export { grayScale, rotateImage, blurImage };
