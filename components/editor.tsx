"use client";

import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

export const Editor = ({ onChange, value }: EditorProps) => {
  return (
    <SunEditor
      setContents={value}
      onChange={onChange}
      setOptions={{
        height: "auto",
        defaultStyle: "font-size: 16px; line-height: 1.6;",
        buttonList: [
            ["bold", "italic", "underline", "strike"],
            ["font", "fontSize", "formatBlock"],
            ["align", "list", "lineHeight"],
            ["link"],
            ["undo", "redo"],
            ["removeFormat"],
          ],
      }}
    />
  );
};
