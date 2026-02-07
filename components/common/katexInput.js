import React, { useEffect, useState } from "react";
import katex from "katex";

const KatexInput = ({ inputValue }) => {
  const [output, setOutput] = useState(null);
  useEffect(() => {
    try {
      katex.render(inputValue, output);
    } catch (err) {
      console.log(err.message);
    }
  }, [inputValue, output]);
  return (
    <div className="katex-holder">
      <div ref={(elem) => setOutput(elem)}></div>
    </div>
  );
};
export default KatexInput;
