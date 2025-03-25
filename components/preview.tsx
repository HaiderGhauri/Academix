"use client";

import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  return (
    <div>
      <SunEditor
        setContents={value}
        disable={true}
        hideToolbar={true}
        setDefaultStyle="font-size: 16px; line-height: 1.6;"
        setOptions={{
          height: "auto",
          resizingBar: false,
        }}
      />
    </div>
  );
};
