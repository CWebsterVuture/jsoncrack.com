import React from "react";
import { Modal, Group, Button, TextInput, Stack, Divider, ModalProps } from "@mantine/core";
import toast from "react-hot-toast";
import { AiOutlineUpload } from "react-icons/ai";
import useJson from "src/store/useJson";
import useStored from "src/store/useStored";
import styled from "styled-components";

const StyledUploadWrapper = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};
  border: 2px dashed ${({ theme }) => theme.BACKGROUND_TERTIARY};
  border-radius: 5px;
  min-height: 200px;
  padding: 16px;
  cursor: pointer;

  input[type="file"] {
    display: none;
  }
`;

const StyledFileName = styled.span`
  padding-top: 14px;
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
`;

const StyledUploadMessage = styled.h3`
  color: ${({ theme }) => theme.INTERACTIVE_ACTIVE};
  margin-bottom: 0;
`;

export const ImportModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const setJson = useJson(state => state.setJson);
  const editorLanguage = useStored(state => (state.editorLanguage));
  const [url, setURL] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files?.item(0));
  };

  const handleFileDrag = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();

    if (e.type === "drop" && e.dataTransfer.files.length) {
      let fileType;
      switch(editorLanguage){
        case "json":
          fileType = "application/json";
          break;
        case "yaml":
          fileType =  "text/yaml";
          break;
        default:
          fileType = "application/json";
          break;
      }
      if (e.dataTransfer.files[0].type === fileType) {
        setFile(e.dataTransfer.files[0]);
      } else {
        toast.error(`Please upload ${editorLanguage.toUpperCase()} file!`);
      }
    }
  };

  const handleImportFile = () => {
    if (url) {
      setFile(null);
      toast.loading("Loading...", { id: "toastFetch" });
      return fetch(url)
        .then(res => res.json())
        .then(json => {
          setJson(JSON.stringify(json, null, 2));
          onClose();
        })
        .catch(() => toast.error("Failed to fetch JSON/YAML!"))
        .finally(() => toast.dismiss("toastFetch"));
    }

    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (data) {
        setJson(data.target?.result as string);
        onClose();
      };
    }
  };
  let fileType;
  switch(editorLanguage){
    case "json":
      fileType = "application/json";
      break;
    case "yaml":
      fileType =  "*/yml,*/yaml, */x-yaml, */x-yml";
      break;
    default:
      fileType = "application/json";
      break;
  }
  return (
    <Modal title="Import File" opened={opened} onClose={onClose} centered>
      <Stack py="sm">
        <TextInput
          value={url}
          onChange={e => setURL(e.target.value)}
          type="url"
          placeholder="URL of File to fetch"
          data-autofocus
        />
        <StyledUploadWrapper onDrop={handleFileDrag} onDragOver={handleFileDrag}>
          <input
            key={file?.name}
            onChange={handleFileChange}
            type="file"
            accept={fileType}
          />
          <AiOutlineUpload size={48} />
          <StyledUploadMessage>Click Here to Upload File</StyledUploadMessage>
          <StyledFileName>{file?.name ?? "None"}</StyledFileName>
        </StyledUploadWrapper>
      </Stack>
      <Divider py="xs" />
      <Group position="right">
        <Button onClick={handleImportFile} disabled={!(file || url)}>
          Import
        </Button>
      </Group>
    </Modal>
  );
};
