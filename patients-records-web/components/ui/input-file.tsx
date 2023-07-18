/** @format */

import { useState } from "react";
import classes from "./input-file.module.css";

import Image from "next/image";
import { saveAs } from "file-saver";
import Modal, { ModalTheme } from "./modal";

export type Photo = {
  file: File;
  url: string;
};

type Props = {
  label: string;
  hasError: boolean;
  errorMessage: string;
  selectedPhotos: File[] | undefined;
  onChangeHandler: (newValue: File[] | undefined) => void;
  onBlurHandler: () => void;
};

const InputFile = ({
  label,
  hasError,
  errorMessage,
  selectedPhotos,
  onChangeHandler,
  onBlurHandler,
}: Props) => {
  const [photoUrls, setPhotoUrls] = useState<any[] | undefined>(undefined);
  const [displayText, setDisplayText] = useState<string | undefined>("");
  const [showPhotosActions, setShowPhotosActions] = useState<
    boolean[] | undefined
  >(undefined);
  const [isHovered, setHover] = useState(false);
  const [isViewPhotoModalOpen, setIsViewPhotoModalOpen] =
    useState<boolean>(false);
  const [photoBeingViewed, setPhotoBeingViewed] = useState<Photo | undefined>(
    undefined
  );

  const handleFileChange = (event: any) => {
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
    if (selectedPhotos) {
      selectedPhotos = [...selectedPhotos!, ...newFiles];
    } else {
      selectedPhotos = newFiles;
    }

    if (selectedPhotos && selectedPhotos.length > 1) {
      setDisplayText(`${selectedPhotos.length} fotos selecionadas...`);
    } else if (selectedPhotos && selectedPhotos.length === 1) {
      setDisplayText(`1 foto selecionada...`);
    } else {
      setDisplayText(`Nenhuma foto selecionada...`);
    }

    onChangeHandler(selectedPhotos);
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

    selectedPhotos!.splice(itemIndex, 1);

    if (selectedPhotos && selectedPhotos.length > 1) {
      setDisplayText(`${selectedPhotos.length} fotos selecionadas...`);
    } else if (selectedPhotos && selectedPhotos.length === 1) {
      setDisplayText(`1 foto selecionada...`);
    } else {
      setDisplayText(`Nenhuma foto selecionada...`);
    }

    onChangeHandler(selectedPhotos);
  };

  const onDownloadImageHandler = (index: number) => {
    const url = photoUrls![index];
    const fileName = selectedPhotos![index];
    saveAs(url, fileName.name);
  };

  const onViewOriginalPhotoSizeHandler = (index: number) => {
    const photo: Photo = {
      url: photoUrls![index],
      file: { ...selectedPhotos![index] } as File,
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
          {photoUrls ? (
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
          <div className={classes.container}>
            <Image
              src={`/images/upload.svg`}
              alt="Upload"
              width={48}
              height={48}
            />
            <p className={classes.number_files}>
              {displayText || "Click aqui para selecionar suas fotos"}
            </p>
            <input
              type="file"
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
