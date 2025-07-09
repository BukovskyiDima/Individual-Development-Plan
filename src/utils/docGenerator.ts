import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import mammoth from "mammoth";

function getTitleParagraph(t: (key: string) => string) {
  return new Paragraph({
    children: [
      new TextRun({
        text: t("documentTitle"),
        bold: true,
        size: 36,
      }),
    ],
    heading: HeadingLevel.TITLE,
    spacing: { after: 300 },
  });
}

function getEmployeeParagraph(
  formData: { [key: string]: string | null },
  t: (key: string) => string
) {
  return new Paragraph({
    children: [
      new TextRun({
        text: `${t("employeeName")}: `,
        bold: true,
        size: 24,
      }),
      new TextRun({ text: formData.name || "", size: 24 }),
    ],
  });
}

function getManagerParagraph(
  formData: { [key: string]: string | null },
  t: (key: string) => string
) {
  return new Paragraph({
    children: [
      new TextRun({
        text: `${t("manager")}: `,
        bold: true,
        size: 24,
      }),
      new TextRun({ text: formData.manager || "", size: 24 }),
    ],
  });
}

function getGeneralGoalsBlock(
  formData: { [key: string]: string | null },
  t: (key: string) => string
) {
  return [
    new Paragraph({
      text: t("goalsGeneral"),
      heading: HeadingLevel.HEADING_2,
      spacing: { after: 100 },
    }),
    ...(formData.goalsGeneralByLevel || "")
      .split("\n")
      .filter(Boolean)
      .map(
        (line) =>
          new Paragraph({
            children: [new TextRun({ text: line, size: 24 })],
          })
      ),
    ...(formData.goalsGeneral || "")
      .split("\n")
      .filter(Boolean)
      .map(
        (goal: string) =>
          new Paragraph({
            children: [new TextRun({ text: goal, size: 24 })],
          })
      ),
    new Paragraph({ text: "" }),
  ];
}

function getSoftGoalsBlock(
  formData: { [key: string]: string | null },
  t: (key: string) => string
) {
  return [
    new Paragraph({
      text: t("goalsSoft"),
      heading: HeadingLevel.HEADING_2,
      spacing: { after: 100 },
    }),
    ...(formData.goalsSoftByLevel || "")
      .split("\n")
      .filter(Boolean)
      .map(
        (line) =>
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                size: 24,
              }),
            ],
          })
      ),
    new Paragraph({ text: "" }),
    ...(formData.goalsSoft || "")
      .split("\n")
      .filter(Boolean)
      .map(
        (goal: string) =>
          new Paragraph({
            children: [new TextRun({ text: goal, size: 24 })],
          })
      ),
  ];
}

function getTechGoalsBlock(
  formData: { [key: string]: string | null },
  t: (key: string) => string
) {
  return [
    new Paragraph({
      text: t("goalsTech"),
      heading: HeadingLevel.HEADING_2,
      spacing: { after: 100 },
    }),
    ...(formData.goalsTechByLevel || "")
      .split("\n")
      .filter(Boolean)
      .map(
        (line) =>
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                size: 24,
              }),
            ],
          })
      ),
    new Paragraph({ text: "" }),
    ...(formData.goalsTech || "")
      .split("\n")
      .filter(Boolean)
      .map(
        (goal: string) =>
          new Paragraph({
            children: [new TextRun({ text: goal, size: 24 })],
          })
      ),
  ];
}

export const generateDocPreview = async ({
  formData,
  t,
}: {
  formData: { [key: string]: string | null };
  t: (key: string) => string;
}): Promise<Blob> => {
  const doc = new Document({
    sections: [
      {
        children: [
          getTitleParagraph(t),
          getEmployeeParagraph(formData, t),
          getManagerParagraph(formData, t),
          new Paragraph({ text: "" }),
          ...getGeneralGoalsBlock(formData, t),
          ...getSoftGoalsBlock(formData, t),
          ...getTechGoalsBlock(formData, t),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
};

export const generateDoc = async ({
  formData,
  t,
}: {
  formData: { [key: string]: string | null };
  t: (key: string) => string;
}): Promise<void> => {
  const blob = await generateDocPreview({ formData, t });
  saveAs(
    blob,
    `IPR_${formData.name || "employee"}_${
      formData.targetLevel || "unknown"
    }.docx`
  );
};

export const docxBlobToHtml = async (blob: Blob): Promise<string> => {
  const arrayBuffer = await blob.arrayBuffer();
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
  return html;
};
