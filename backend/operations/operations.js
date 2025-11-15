import sharp from "sharp";
import fs from "fs/promises";

async function grayScale(inputPath) {
  try {
    const outputBuffer = await sharp(inputPath).grayscale().toBuffer(); // image processing
    if (!outputBuffer) throw new Error("Error while processing image."); // error while processing
    await fs.unlink(inputPath); // delete original if success

    return outputBuffer;
  } catch (error) {
    console.log("Grayscale error : ", { error });
    throw error;
  }
}

async function rotateImage(inputPath, deg) {
  try {
    const outputBuffer = await sharp(inputPath).rotate(deg).toBuffer();
    if (!outputBuffer) throw new Error("Error while processing image."); // error while processing
    await fs.unlink(inputPath); // delete original if success
    
    return outputBuffer;
  } catch (error) {
    console.log("Rotate error : ", { error });
    throw error;
  }
}

async function blurImage(inputPath, perc) {
  try {
    const outputBuffer = await sharp(inputPath).blur(perc).toBuffer();
    if (!outputBuffer) throw new Error("Error while processing image."); // error while processing
    await fs.unlink(inputPath); // delete original if success

    return outputBuffer;
  } catch (error) {
    console.log("Blur error : ", { error });
    throw error;
  }
}

async function sharpenImage(inputPath, sigma) {
  try {
    const outputBuffer = await sharp(inputPath).sharpen({ sigma: sigma }).toBuffer();
    if (!outputBuffer) throw new Error("Error while processing image."); // error while processing
    await fs.unlink(inputPath); // delete original if success

    return outputBuffer;
  } catch (error) {
    console.log("Sharpen error : ", { error });
    throw error;
  }
}

export { grayScale, rotateImage, blurImage, sharpenImage };
