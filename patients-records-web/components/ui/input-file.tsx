/** @format */

import { useLayoutEffect, useRef, useState } from "react";
import classes from "./input-file.module.css";

import Image from "next/image";
import { saveAs } from "file-saver";
import Modal, { ModalTheme } from "./modal";
import { FileCustom } from "@/hooks/use-file-input";

export enum FILE_TYPE {
  PHOTO = 1,
  DOCUMENT = 2,
}

type Props = {
  label: string;
  hasError: boolean;
  errorMessage: string;
  selectedFiles: FileCustom[] | undefined;
  onChangeHandler: (newValue: FileCustom[] | undefined) => void;
  onBlurHandler: () => void;
  onUpdateselectedFile?: () => void;
  noFilesSelectedMessage?: string;
  fileTypeDisplayName?: string;
  fileType?: FILE_TYPE;
};

const InputFile = ({
  label,
  hasError,
  errorMessage,
  selectedFiles,
  onChangeHandler,
  onBlurHandler,
  noFilesSelectedMessage,
  fileType,
}: Props) => {
  const [photoUrls, setPhotoUrls] = useState<any[] | undefined>(undefined);
  const [displayText, setDisplayText] = useState<string | undefined>("");
  const [showPhotosActions, setShowPhotosActions] = useState<
    boolean[] | undefined
  >(undefined);
  const [isHovered, setHover] = useState(false);
  const [isViewPhotoModalOpen, setIsViewPhotoModalOpen] =
    useState<boolean>(false);
  const [photoBeingViewed, setPhotoBeingViewed] = useState<
    FileCustom | undefined
  >(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (selectedFiles && selectedFiles.length > 0) updateFiles(selectedFiles);
  }, [selectedFiles]);

  const updateFiles = (files: FileCustom[] | null | undefined) => {
    if (files && files.length > 1) {
      setDisplayText(
        `${files.length} ${
          !fileType || fileType === FILE_TYPE.PHOTO ? "fotos" : "arquivos"
        } selecionadas...`
      );
    } else if (files && files.length === 1) {
      setDisplayText(
        `1 ${
          !fileType || fileType === FILE_TYPE.PHOTO
            ? "foto selecionda"
            : "arquivo selecionado"
        }`
      );
    } else {
      setDisplayText(
        `${
          !fileType || fileType === FILE_TYPE.PHOTO
            ? "Nenhuma foto selecionada"
            : "Nenhum arquivo selecionado"
        }...`
      );
    }

    let images: any[] = [];
    let removeButtonArray: boolean[] = [];
    if (files) {
      for (let i = 0; i < files.length; i++) {
        images.push(URL.createObjectURL(files[i].file));
        removeButtonArray.push(false);
      }
    }
    setPhotoUrls(images);
    setShowPhotosActions(removeButtonArray);

    if (files) {
      onChangeHandler(files);
    } else {
      onChangeHandler(undefined);
    }
  };

  const handleFileChange = (event: any) => {
    let images: any[] = [];
    let removeButtonArray: boolean[] = [];
    for (let i = 0; i < event.target.files.length; i++) {
      images.push(URL.createObjectURL(event.target.files[i]));
      removeButtonArray.push(false);
    }
    setPhotoUrls((prevState) => {
      if (prevState) {
        prevState = [...prevState!, ...images];
      } else {
        return images;
      }
      return prevState;
    });
    setShowPhotosActions((prevState) => {
      if (prevState) {
        prevState = [...prevState!, ...removeButtonArray];
      } else {
        return removeButtonArray;
      }
      return prevState;
    });
    const newFiles = Array.from(event.target.files) as File[];
    let newSelectedFiles = selectedFiles ? [...selectedFiles] : [];
    if (newSelectedFiles && newSelectedFiles.length > 0) {
      newSelectedFiles = [
        ...newSelectedFiles!,
        ...newFiles.map((newFile) => {
          return { file: newFile };
        }),
      ];
    } else {
      newSelectedFiles = newFiles.map((newFile) => {
        return { file: newFile };
      });
    }

    if (newSelectedFiles && newSelectedFiles.length > 1) {
      setDisplayText(
        `${newSelectedFiles.length} ${
          !fileType || fileType === FILE_TYPE.PHOTO ? "fotos" : "arquivos"
        } selecionadas...`
      );
    } else if (newSelectedFiles && newSelectedFiles.length === 1) {
      setDisplayText(
        `1 ${
          !fileType || fileType === FILE_TYPE.PHOTO
            ? "foto selecionda"
            : "arquivo selecionado"
        }`
      );
    } else {
      setDisplayText(
        `${
          !fileType || fileType === FILE_TYPE.PHOTO
            ? "Nenhuma foto selecionada"
            : "Nenhum arquivo selecionado"
        }...`
      );
    }

    onChangeHandler(newSelectedFiles);
  };

  const onMouseOverSelectedImageHanlder = (index: number) => {
    onBlurHandler();
    setHover(true);
    setShowPhotosActions((prevState) => {
      if (prevState) {
        prevState[index] = true;
      }
      return prevState;
    });
  };

  const onMouseLeaveSelectedImageHanlder = (index: number) => {
    setHover(false);
    setShowPhotosActions((prevState) => {
      if (prevState) {
        prevState[index] = false;
      }
      return prevState;
    });
  };

  const onDeleteImageHandler = (itemIndex: number) => {
    setShowPhotosActions((prevState) => {
      prevState?.splice(itemIndex, 1);
      return prevState;
    });
    setPhotoUrls((prevState) => {
      prevState?.splice(itemIndex, 1);
      return prevState;
    });

    const newSelectedFiles = selectedFiles ? [...selectedFiles] : [];

    newSelectedFiles.splice(itemIndex, 1);

    if (newSelectedFiles && newSelectedFiles.length > 1) {
      setDisplayText(
        `${newSelectedFiles.length} ${
          !fileType || fileType === FILE_TYPE.PHOTO ? "fotos" : "arquivos"
        } selecionadas...`
      );
    } else if (newSelectedFiles && newSelectedFiles.length === 1) {
      setDisplayText(
        `1 ${
          !fileType || fileType === FILE_TYPE.PHOTO
            ? "foto selecionda"
            : "arquivo selecionado"
        }`
      );
    } else {
      setDisplayText(
        `${
          !fileType || fileType === FILE_TYPE.PHOTO
            ? "Nenhuma foto selecionada"
            : "Nenhum arquivo selecionado"
        }...`
      );
    }

    onChangeHandler(newSelectedFiles);
  };

  const onDownloadImageHandler = (index: number) => {
    const url = photoUrls![index];
    const fileName = selectedFiles![index];
    saveAs(url, fileName.name);
  };

  const onViewOriginalPhotoSizeHandler = (index: number) => {
    const photo: FileCustom = {
      url: photoUrls![index],
      file: selectedFiles![index].file,
    };
    setIsViewPhotoModalOpen(true);
    setPhotoBeingViewed(photo);
  };

  return (
    <>
      <div className={classes.photos_container}>
        <p className={classes.photos_container_title}>{label}</p>
        {isViewPhotoModalOpen && (
          <Modal
            onClose={() => {
              setIsViewPhotoModalOpen(false);
              setPhotoBeingViewed(undefined);
            }}
            title={photoBeingViewed?.file.name!}
            theme={ModalTheme.PHOTO_VIEWWER}
          >
            <>
              <Image
                src={photoBeingViewed?.url!}
                alt="Image being viewed"
                width={110}
                height={100}
                style={{
                  height: "100%",
                  width: "100%",
                }}
              />
            </>
          </Modal>
        )}
        <div className={classes.containers}>
          {(!fileType || fileType === FILE_TYPE.PHOTO) && photoUrls ? (
            photoUrls.map((file, index) => (
              <div
                key={index}
                className={classes.container_selected}
                onMouseOver={onMouseOverSelectedImageHanlder.bind(null, index)}
                onMouseLeave={onMouseLeaveSelectedImageHanlder.bind(
                  null,
                  index
                )}
              >
                <Image
                  src={file}
                  alt="Upload"
                  width={110}
                  height={100}
                  style={{ height: "100%", width: 220 }}
                />
                {isHovered && showPhotosActions && showPhotosActions[index] && (
                  <div className={classes.on_hover_actions}>
                    <div
                      className={classes.on_hover_action}
                      onClick={onDownloadImageHandler.bind(null, index)}
                    >
                      <Image
                        src={`/images/download.svg`}
                        alt="Download"
                        width={48}
                        height={48}
                      />
                    </div>
                    <div
                      className={classes.on_hover_action}
                      onClick={onDeleteImageHandler.bind(null, index)}
                    >
                      <Image
                        src={`/images/delete.svg`}
                        alt="Delete"
                        width={48}
                        height={48}
                      />
                    </div>
                    <div
                      className={classes.on_hover_action}
                      onClick={onViewOriginalPhotoSizeHandler.bind(null, index)}
                    >
                      <Image
                        src={`/images/eye.svg`}
                        alt="Eye"
                        width={48}
                        height={48}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <></>
          )}
          {fileType === FILE_TYPE.DOCUMENT && selectedFiles ? (
            <div>
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className={classes.document_container_selected}
                  onMouseOver={onMouseOverSelectedImageHanlder.bind(
                    null,
                    index
                  )}
                  onMouseLeave={onMouseLeaveSelectedImageHanlder.bind(
                    null,
                    index
                  )}
                >
                  <div className={classes.document_name_container}>
                    <p className={classes.document_name_paragraph}>
                      {file.file.name}
                    </p>
                  </div>
                  {isHovered &&
                    showPhotosActions &&
                    showPhotosActions[index] && (
                      <div className={classes.on_hover_actions}>
                        <div
                          className={classes.on_hover_action}
                          onClick={onDownloadImageHandler.bind(null, index)}
                        >
                          <Image
                            src={`/images/download.svg`}
                            alt="Download"
                            width={48}
                            height={48}
                          />
                        </div>
                        <div
                          className={classes.on_hover_action}
                          onClick={onDeleteImageHandler.bind(null, index)}
                        >
                          <Image
                            src={`/images/delete.svg`}
                            alt="Delete"
                            width={48}
                            height={48}
                          />
                        </div>
                        <div
                          className={classes.on_hover_action}
                          onClick={onViewOriginalPhotoSizeHandler.bind(
                            null,
                            index
                          )}
                        >
                          <Image
                            src={`/images/eye.svg`}
                            alt="Eye"
                            width={48}
                            height={48}
                          />
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}
          <div className={classes.container}>
            <Image
              src={`/images/upload.svg`}
              alt="Upload"
              width={48}
              height={48}
            />
            <p className={classes.number_files}>
              {displayText ||
                (noFilesSelectedMessage ??
                  "Click aqui para selecionar suas fotos")}
            </p>
            <input
              type="file"
              ref={fileInputRef}
              multiple={true}
              onChange={handleFileChange}
              onBlur={onBlurHandler}
            />
          </div>
        </div>
        {hasError && <p className={classes.error_text}>{errorMessage}</p>}
      </div>
    </>
  );
};

export default InputFile;
