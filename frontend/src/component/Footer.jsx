function Footer() {
  return (
    <div className="footer">
      <div className="left_footer">
        <h1>Imagika</h1>
        <p>
          A fast and interactive image manipulation tool built with React and
          Node.js, featuring real-time processing using Sharp. Users can upload
          an image, choose from multiple operations, adjust intensity levels,
          and download the final result — all within a clean and responsive UI.
        </p>
      </div>

      <div className="right_footer">
        <div>
          <h1>Me</h1>
          <div className="about">
            <img src="me.png" alt="Me" className="footer_img" />
            <div className="socials">
              <a href="https://github.com/therealakash13"><img src="github.png" alt="github" /></a>
              <a href="mailto:therealakash13@gmail.com"><img src="gmail.png" alt="gmail" /></a>
              <a href="https://www.linkedin.com/in/akashkumar0"><img src="linkedin.png" alt="linkedin" /></a>
            </div>
          </div>
        </div>

        <div className="stack">
          <h1>Stack</h1>
          <div>
            <h3>Backend:<span>Node.js, Express.js</span></h3>
            <h3>Image Processing:<span>Sharp</span></h3>
            <h3>HTTP Client:<span>Axios</span></h3>
            <h3>State Management:<span>React Hooks (useState, useEffect)</span></h3>
            <h3>Build Tools:<span>Vite</span></h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
