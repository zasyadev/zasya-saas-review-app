import React from "react";
import ReactDragListView from "react-drag-listview";

function DragableComponent({ stateData, handleChange, children }) {
  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      const data = [...stateData];
      const item = data.splice(fromIndex, 1)[0];
      data.splice(toIndex, 0, item);
      handleChange(data);
    },
    nodeSelector: ".dragable-div",
    handleSelector: ".dragable-content",
    lineClassName: "bg-gray-100 border-0 h-12",
  };
  return <ReactDragListView {...dragProps}>{children}</ReactDragListView>;
}

export default DragableComponent;
