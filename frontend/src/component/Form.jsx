import { useState } from "react";
import axios from "axios";

function Form() {
  const [image, setImage] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [operation, setOperation] = useState(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImageUrl(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!image) {
      alert("Please select an image");
      return;
    }
    if (!operation) {
      alert("Please select an operation");
      return;
    }

    const imageBuffer = await image.arrayBuffer(); // converting image file to buffer stream

    try {
      const response = await axios.post(
        `http://localhost:3000/upload?op=${operation}`,
        imageBuffer,
        {
          headers: { "Content-Type": "application/octet-stream" },
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(blob);

      setProcessedImageUrl(imageUrl);
      // setImage("");
    } catch (err) {
      const decoder = new TextDecoder("utf-8"); // initializing new decoder
      const errorText = decoder.decode(err.response.data); // decoding array buffer
      const errorJson = JSON.parse(errorText); // parsing stringified json

      const { error, message } = errorJson; // extracting error and message from json

      alert(message + " : " + error);
    }
  }
  return (
    <div className="image_form">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="file"
          accept="image/*"
          name="imageFile"
          onChange={handleFileChange}
        />
        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
          className="border border-gray-400 rounded-md px-3 py-2"
          required
        >
          <option value="grayscale">Grayscale</option>
          <option value="resize">Resize (800px width)</option>
          <option value="rotate">Rotate (90°)</option>
          <option value="blur">Blur</option>
          <option value="sharpen">Sharpen</option>
        </select>
        <button className="btn-primary" type="submit">
          Convert...
        </button>
      </form>
      <img src={previewImageUrl} alt="preview image" />
      <img src={processedImageUrl} alt="processed image" />
    </div>
  );
}
export default Form;
