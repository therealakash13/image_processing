import { useState, useEffect} from "react";
import axios from "axios";

function Form() {
  const [image, setImage] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [operation, setOperation] = useState("");
  const [level, setLevel] = useState(0);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImageUrl(URL.createObjectURL(file));
      setProcessedImageUrl(null);
    }
  }

  useEffect(() => {
    if (!image || !operation) {
      alert("Please select an image and an operation");
      return;
    }

    const needLevel = ["rotate", "blur", "sharpen"].includes(operation); 
    // returns true if operations are one of them

    if ((needLevel && level === null) || level === "") {
      // another check for angle
      alert("Please select correct level or intensity");
      return;
    }

    const timeout = setTimeout(async () => {
      const imageBuffer = await image.arrayBuffer(); // converting image file to buffer stream

      try {
        const response = await axios.post(
          `http://localhost:3000/upload?op=${operation}&level=${level}`,
          imageBuffer,
          {
            headers: { "Content-Type": "application/octet-stream" },
            responseType: "arraybuffer",
          }
        );

        const blob = new Blob([response.data], { type: "image/png" });
        const imageUrl = URL.createObjectURL(blob);

        setProcessedImageUrl(imageUrl);
      } catch (err) {
        const decoder = new TextDecoder("utf-8"); // initializing new decoder
        const errorText = decoder.decode(err.response.data); // decoding array buffer
        const errorJson = JSON.parse(errorText); // parsing stringified json

        const { error, message } = errorJson; // extracting error and message from json

        alert(message + " : " + error);
      }
    }, 300); // debounce request for 300ms

    return () => clearTimeout(timeout); // clearing timeout
  }, [image, operation, level]);

  useEffect(() => {
    if (operation === "rotate") setLevel(0);
    else if (operation === "blur") setLevel(1);
    else if (operation === "sharpen") setLevel(1);
    else setLevel(0);
  }, [operation]);

  return (
    <div className="image_form">
      <div className="section">
        <h2>Choose an operation: </h2>
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
      </div>

      {previewImageUrl === null && (
        <div className="section">
          <h2>Choose a file: </h2>
          <input
            type="file"
            accept="image/*"
            name="imageFile"
            onChange={handleFileChange}
          />
        </div>
      )}

      <div className="section">
        {["rotate", "blur", "sharpen"].includes(operation) && (
          <h2>Choose intensity: </h2>
        )}
        {operation === "rotate" && (
          <div className="subsection">
            <input
              className="range"
              type="range"
              onChange={(e) => setLevel(e.target.value)}
              min="0"
              defaultValue="1"
              max="360"
              step="90"
            />
            <h3>{level}</h3>
          </div>
        )}

        {operation === "blur" && (
          <div className="subsection">
            <input
              className="range"
              type="range"
              onChange={(e) => setLevel(e.target.value)}
              min="1"
              defaultValue="1"
              max="10"
              step="1"
            />
            <h3>{level}</h3>
          </div>
        )}

        {operation === "sharpen" && (
          <div className="subsection">
            <input
              className="range"
              type="range"
              onChange={(e) => setLevel(e.target.value)}
              min="1"
              defaultValue="1"
              max="10"
              step="1"
            />
            <h3>{level}</h3>
          </div>
        )}
      </div>

      {previewImageUrl && <img src={previewImageUrl} alt="preview image" />}
      {processedImageUrl && (
        <img src={processedImageUrl} alt="processed image" />
      )}
    </div>
  );
}
export default Form;
