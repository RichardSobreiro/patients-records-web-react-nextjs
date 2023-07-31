/** @format */

import useFileInput, { FileCustom } from "@/hooks/use-file-input";
import classes from "./file-anamnesis-type.module.css";
import InputFile, { FILE_TYPE } from "@/components/ui/input-file";
import { useEffect } from "react";
import { Item } from "@/components/ui/dropdown-service-type";
import { ItemAnamnesis } from "@/components/ui/dropdown-anamnesis-type";

type Props = {
  anamnesisTypeId: string;
  setSelectedFiles: (files: FileCustom[] | undefined) => void;
  selectedTypes: Item | Item[] | ItemAnamnesis[] | undefined;
  setTypes: any;
};

const FileAnamnesisType = ({
  anamnesisTypeId,
  setSelectedFiles,
  selectedTypes,
  setTypes,
}: Props) => {
  const {
    selectedFile: files,
    isValid: filesIsValid,
    hasError: filesHasError,
    valueChangeHandler: filesChangeHandler,
    inputBlurHandler: filesBlurHandler,
    reset: resetFiles,
    errorMessage: filesErrorMessage,
    setSelectedFile: setFiles,
  } = useFileInput({ validateValue: () => true });

  useEffect(() => {
    setSelectedFiles(files);
  }, [files]);

  return (
    <>
      <InputFile
        label={"Arquivos:"}
        hasError={filesHasError}
        errorMessage={filesErrorMessage}
        selectedFiles={files}
        onChangeHandler={filesChangeHandler}
        onBlurHandler={filesBlurHandler}
        noFilesSelectedMessage="Click aqui para selecionar seus arquivos"
        fileType={FILE_TYPE.DOCUMENT}
      />
    </>
  );
};

export default FileAnamnesisType;
