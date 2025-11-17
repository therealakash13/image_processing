import sharp from "sharp";
import fs from "fs/promises";

async function grayScale(inputBuffer) {
  try {
    const outputBuffer = await sharp(inputBuffer).grayscale().toBuffer(); // image processing
    if (!outputBuffer) throw new Error("Error while processing image."); // error while processing

    return outputBuffer;
  } catch (error) {
    console.log("Grayscale error : ", { error });
    throw error;
  }
}

async function rotateImage(inputBuffer, deg) {
  try {
    const outputBuffer = await sharp(inputBuffer).rotate(deg).toBuffer();
    if (!outputBuffer) throw new Error("Error while processing image."); // error while processing
    
    return outputBuffer;
  } catch (error) {
    console.log("Rotate error : ", { error });
    throw error;
  }
}

async function blurImage(inputBuffer, perc) {
  try {
    const outputBuffer = await sharp(inputBuffer).blur(perc).toBuffer();
    if (!outputBuffer) throw new Error("Error while processing image."); // error while processing

    return outputBuffer;
  } catch (error) {
    console.log("Blur error : ", { error });
    throw error;
  }
}

async function sharpenImage(inputBuffer, sigma) {
  try {
    const outputBuffer = await sharp(inputBuffer).sharpen({ sigma: sigma }).toBuffer();
    if (!outputBuffer) throw new Error("Error while processing image."); // error while processing

    return outputBuffer;
  } catch (error) {
    console.log("Sharpen error : ", { error });
    throw error;
  }
}

export { grayScale, rotateImage, blurImage, sharpenImage };
