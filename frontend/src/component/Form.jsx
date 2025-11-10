import { useState } from "react";
import axios from "axios";

function Form() {
  const [name, setName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(name);
    try {
      const response = await axios.post("http://localhost:3000/", {name});
      console.log(response);
      setName("");
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Submit</button>
        {/* <input type="text" name="" id="" /> */}
      </form>
    </>
  );
}
export default Form;
