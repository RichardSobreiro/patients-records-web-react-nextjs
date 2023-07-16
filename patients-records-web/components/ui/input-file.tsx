/** @format */

import Image from "next/image";
import { useRef, useState } from "react";

import classes from "./input-file.module.css";

const InputFile = () => {
  const [filesThumbnails, setFilesThumbnails] = useState<any[] | undefined>(
    undefined
  );
  const [selectedFiles, setSelectedFiles] = useState<FileList | undefined>(
    undefined
  );
  const [displayText, setDisplayText] = useState<string | undefined>("");
  const [displayRemoveButton, setDisplayRemoveButton] = useState<
    boolean[] | undefined
  >(undefined);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedFiles(event.target.files);
    if (event.target.files.length > 1) {
      setDisplayText(`${event.target.files.length} fotos selecionadas...`);
    } else if (event.target.files.length === 1) {
      setDisplayText(`1 foto selecionada...`);
    } else {
      setDisplayText(`Nenhuma foto selecionada...`);
    }

    let images: any[] = [];
    let removeButtonArray: boolean[] = [];
    for (let i = 0; i < event.target.files.length; i++) {
      images.push(URL.createObjectURL(event.target.files[i]));
    }
    setFilesThumbnails(images);
  };

  return (
    <div className={classes.containers}>
      {filesThumbnails ? (
        filesThumbnails.map((file, index) => (
          <div
            key={index}
            className={classes.container_selected}
            onMouseOver={() => {}}
          >
            <Image
              src={file}
              alt="Upload"
              width={110}
              height={100}
              style={{ height: "100%", width: 120 }}
            />
          </div>
        ))
      ) : (
        <></>
      )}
      <div className={classes.container}>
        <Image src={`/images/upload.svg`} alt="Upload" width={48} height={48} />
        <p className={classes.number_files}>
          {displayText || "Click aqui para selecionar suas fotos"}
        </p>
        <input type="file" multiple={true} onChange={handleFileChange} />
      </div>
    </div>
  );
};

export default InputFile;
