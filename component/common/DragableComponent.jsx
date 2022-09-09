import Head from "next/head";
import React from "react";
import ReactDragListView from "react-drag-listview";

function DragableComponent({ stateData, handleChange, children }) {
  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      const data = [...stateData];
      const item = data.splice(fromIndex, 1)[0];
      data.splice(toIndex, 0, item);
      handleChange(data, fromIndex, toIndex);
    },
    nodeSelector: ".dragable-div",
    handleSelector: ".dragable-content",
    lineClassName: "bg-gray-100 border-0 h-12",
    enableScroll: false,
  };
  return (
    <>
      <Head>
        <script
          id="DragDropTouch"
          src="https://bernardo-castilho.github.io/DragDropTouch/DragDropTouch.js"
        ></script>
      </Head>
      <ReactDragListView {...dragProps}>{children}</ReactDragListView>{" "}
    </>
  );
}

export default DragableComponent;
