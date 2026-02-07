import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Equation } from "../../Equation";
import { renderSteps } from "../../../helpers/katex";

const Notes = ({ title, description }) => {
  const equation = useMemo(() => {
    return renderSteps(description);
  }, [description]);
  return (
    <div className="notes-container notes-card" id="notes-container">
      <h2 className="pt-100 pb-3">{title}</h2>
      <Equation className="px-5" equation={equation} />
    </div>
  );
};

Notes.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.arrayOf({}),
};

export default Notes;
