import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const TextEditor = ({ value, onChange }) => {
  return (
    <div>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data); // Pass updated data
        }}
        config={{
          extraPlugins: [uploadPlugin], // Add upload plugin
        }}
      />
    </div>
  );
};

// 🔹 Custom Image Upload Plugin
function uploadPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new UploadAdapter(loader);
  };
}

// 🔹 Custom Upload Adapter for Handling Image Uploads
class UploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }
  upload() {
    const formData = new FormData();
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          formData.append("upload", file);
          fetch("http://localhost:5000/api/crud/upload", {
            method: "POST",
            headers: {
              // Authorization: `Bearer ${SessionManager.shared.getSessionToken()}`,
            },
            body: formData,
          })
            .then((res) => res.json())
            .then((d) => {
              if (d.url) {
                this.loader.uploaded = true;
                resolve({
                  default: d.url, // ✅ Corrected reference
                });
              } else {
                reject(`Couldn't upload file: ${file.name}.`);
              }
            });
        })
    );
  }


  abort() {
    // Handle upload cancellation if needed
  }
}

export default TextEditor;
