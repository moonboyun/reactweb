import axios from "axios";
import { useMemo, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
Quill.register("modules/ImageResize", ImageResize);

const TextEditor = (props) => {
  const data = props.data;
  const setData = props.setData;
  const editorRef = useRef(null);
  const imageHandler = () => {
    //1. input태그 생성
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const files = input.files;
      if (files.length !== 0) {
        const form = new FormData();
        form.append("image", files[0]);
        axios
          .post(`${import.meta.env.VITE_BACK_SERVER}/board/image`, form, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            console.log(res);
            const editor = editorRef.current.getEditor();
            const range = editor.getSelection(); //에디터 내부 이미지를 지칭
            editor.insertEmbed(
              range.index,
              "image",
              `${import.meta.env.VITE_BACK_SERVER}/editor/${res.data}`
            );
            editor.setSelection(range.index + 1);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
  };

  //useMemo 동일한 값을 반환하는경우 함수를 반복적으로 호출하는 것이 아니라
  //메모리에 저장해두고 바로 가져가 사용할 때
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ size: ["small", false, "large", "huge"] }, { color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
            { align: [] },
          ],
          ["image"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      ImageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
    };
  }, []);
  //value에 data, onchange에는 setData를 넣으면 에디터가 알아서 처리해줌
  return (
    <ReactQuill
      ref={editorRef}
      value={data}
      onChange={setData}
      theme="snow"
      modules={modules}
    />
  );
};

export default TextEditor;
