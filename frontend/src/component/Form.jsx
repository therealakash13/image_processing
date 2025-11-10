import { useState } from "react";
import axios from "axios";

function Form() {
  const [image, setImage] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);

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
      alert("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setProcessedImageUrl(response.data.downloadUrl);
      alert(response.data.message);
      // setImage("");
    } catch (error) {
      console.error("Error uploading:", error);
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
        <button className="btn-primary" type="submit">Convert...</button>
      </form>
      <img src={previewImageUrl} alt="preview image" />
      <img src={processedImageUrl} alt="processed image" />
    </div>
  );
}
export default Form;
