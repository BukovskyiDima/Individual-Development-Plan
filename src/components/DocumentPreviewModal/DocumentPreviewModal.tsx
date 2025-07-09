import { Modal, Stack, Group, Button, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { docxBlobToHtml } from "@/utils/docGenerator";

interface DocumentPreviewModalProps {
  opened: boolean;
  onClose: () => void;
  onExport: () => void;
  previewBlob: Blob | null;
  fileName: string;
  t: (key: string) => string;
}

export const DocumentPreviewModal = ({
  opened,
  onClose,
  onExport,
  previewBlob,
  fileName,
  t,
}: DocumentPreviewModalProps) => {
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (opened && previewBlob) {
      setLoading(true);
      docxBlobToHtml(previewBlob)
        .then(setHtml)
        .finally(() => setLoading(false));
    } else {
      setHtml("");
    }
  }, [opened, previewBlob]);

  const handleExport = () => {
    if (previewBlob) {
      saveAs(previewBlob, fileName);
      onExport();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t("documentPreview")}
      size="80vw"
    >
      <Stack gap="md">
        <div
          style={{
            height: "75vh",
            overflow: "auto",
            background: "#fff",
            padding: 8,
          }}
        >
          {loading && <Loader />}
          {!loading && html && (
            <div
              dangerouslySetInnerHTML={{ __html: html }}
              style={{ minHeight: 300 }}
            />
          )}
        </div>
        <Group justify="flex-end">
          <Button variant="outline" onClick={onClose}>
            {t("close")}
          </Button>
          <Button onClick={handleExport}>{t("export")}</Button>
        </Group>
      </Stack>
    </Modal>
  );
};
