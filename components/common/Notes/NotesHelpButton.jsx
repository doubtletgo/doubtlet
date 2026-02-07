import React, { useCallback } from 'react';

const NotesHelpButton = () => {
  const dragToNotes = useCallback(() => {
    document.getElementById('notes-container')?.scrollIntoView();
  }, []);

  return (
    <button
      className="btn btn-primary btn-sm mx-5 px-3 py-0 rounded-pill"
      onClick={dragToNotes}
    >
      <span>Need Help?</span>
    </button>
  );
};

export default NotesHelpButton;
