import { useState } from "react";
import axios from "axios";

function Form() {
  const [image, setImage] = useState("");

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

      console.log("Response:", response.data);
      alert("Upload successful!");
      setImage(null);
    } catch (error) {
      console.error("Error uploading:", error);
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit} enctype="multipart/form-data">
        <input
          type="file"
          accept="image/*"
          name="imageFile"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit">Convert...</button>
      </form>
    </>
  );
}
export default Form;
