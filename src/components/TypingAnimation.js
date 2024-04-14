import React from "react";
import Typed from "typed.js";

const words = ["list art.", "tap art.", "buy art.", "browse art."];

class TypingAnimation extends React.Component {
  componentDidMount() {
    const options = {
      strings: words,
      typeSpeed: 50,
      backSpeed: 50,
      loop: true,
      cursorChar: "|",
    };
    // this.el refers to the <span> in the render() method
    this.typed = new Typed(this.el, options);
  }

  componentWillUnmount() {
    this.typed.destroy();
  }

  render() {
    return (
      <>
        <span
          style={{ whiteSpace: "pre", fontSize: "36px", color: "lightpink" }} // Change font size here
          ref={(el) => {
            this.el = el;
          }}
        />
      </>
    );
  }
}

export default TypingAnimation;
