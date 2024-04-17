import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Contest from "../../types/Contest";

interface Props {
  setCurHtml: Function;
  flag: boolean;
  id?: number;
}

const ContestEditor: React.FC<Props> = ({ setCurHtml, flag, id }) => {
  const { data: contest } = useSWR<Contest>(
    id !== undefined ? `contest/${id}` : "",
    {
      suspense: true,
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
    }
  );

  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法
  // const [editor, setEditor] = useState(null)                   // JS 语法

  // 编辑器内容
  const [html, setHtml] = useState("");

  // 模拟 ajax 请求，异步设置 html
  useEffect(() => {
    setTimeout(() => {
      setHtml(contest?.description || "");
    }, 0);
  }, []);

  useEffect(() => {
    setHtml("");
  }, [flag]);

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {
    insertKeys: { index: 26, keys: ["codeSelectLang"] },
  }; // TS 语法
  // const toolbarConfig = { }                        // JS 语法

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    // TS 语法
    // const editorConfig = {                         // JS 语法
    placeholder: "请输入内容...",
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <>
      <div style={{ border: "1px solid #ccc", zIndex: 100 }}>
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
          style={{ minHeight: "170px", height: "auto", overflowY: "scroll" }}
        />
      </div>
      <div style={{ marginTop: "15px" }}>{html}</div>
    </>
  );
};

export default ContestEditor;
