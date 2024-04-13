import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import React, { useState, useEffect, forwardRef, memo } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";

interface Props {
  setCurHtml: Function;
  commentOk: boolean;
  placeHolder?: string;
}

const CommentEditor: React.ForwardRefRenderFunction<HTMLDivElement, Props> = (
  { setCurHtml, commentOk, placeHolder },
  ref
) => {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法

  // 编辑器内容
  const [html, setHtml] = useState("");

  // 模拟 ajax 请求，异步设置 html
  useEffect(() => {
    setTimeout(() => {
      setHtml("");
    }, 1500);
  }, [commentOk]);

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {
    // excludeKeys: [
    //   "bgColor",
    //   "fontSize", // 字号
    //   "fontFamily", // 字体
    //   "indent", // 增加缩进
    //   "delIndent", // 减少缩进
    //   "justifyLeft", // 左对齐
    //   "justifyRight", // 右对齐
    //   "justifyCenter", // 居中对齐
    //   "justifyJustify",
    //   "insertImage", // 网络图片
    //   "deleteImage", // 删除图片
    //   "editImage", // 编辑图片
    //   "viewImageLink", // 查看链接
    //   "imageWidth30", // 图片宽度相对于编辑器宽度的百分比30
    //   "imageWidth50", // 图片宽度相对于编辑器宽度的百分比50
    //   "imageWidth100", // 图片宽度相对于编辑器宽度的百分比100
    //   "fullScreen",
    // ], // 两端对齐
    toolbarKeys: ["emotion", "codeBlock", "divider", "codeSelectLang"],
  }; // TS 语法
  // const toolbarConfig = { }                        // JS 语法

  let editorConfig: Partial<IEditorConfig> = {
    // TS 语法
    // const editorConfig = {                         // JS 语法
    placeholder: placeHolder || "请输入内容...",
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
      setHtml("");
    };
  }, [editor, placeHolder]);

  return (
    <>
      <div style={{ border: "1px solid #ccc", zIndex: 100 }} ref={ref}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: "1px solid #ccc" }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => {
            setHtml(editor.getHtml());
            setCurHtml(editor.getHtml());
          }}
          mode="default"
          style={{
            minHeight: "30px",
            maxHeight: "15vh",
            overflowY: "scroll",
          }}
        />
      </div>
      {/* <div style={{ marginTop: "15px" }}>{html}</div> */}
    </>
  );
};

export default memo(forwardRef(CommentEditor));
