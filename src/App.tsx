import { useState } from "react";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import {
  TextInput,
  Textarea,
  Button,
  Group,
  Title,
  Stack,
  Container
} from "@mantine/core";

export function App() {
  const [formData, setFormData] = useState<{ 
    name: string; position: string; currentLevel: string; targetLevel: string; periodFrom: string; periodTo: string; manager: string; goalsGeneral: string; goalsTech: string; goalsSoft: string;
    [key: string]: string;
  }>({
    name: "",
    position: "",
    currentLevel: "",
    targetLevel: "",
    periodFrom: "",
    periodTo: "",
    manager: "",
    goalsGeneral: "",
    goalsTech: "",
    goalsSoft: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateDoc = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "Индивидуальный план развития (ИПР)", bold: true, size: 28 }),
              ],
            }),
            ...Object.entries(formData).map(([key, value]) =>
              new Paragraph({
                children: [
                  new TextRun({ text: `${key}: ${value}`, size: 24 })
                ]
              })
            )
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `IPR_${formData.name || "employee"}.docx`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await generateDoc();
    alert("Форма отправлена и документ сохранён!");
  };

  return (
    <Container size="sm" py="md">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Title order={2}>Индивидуальный план развития (ИПР)</Title>

          {[
            ["ФИО сотрудника", "name"],
            ["Должность", "position"],
            ["Текущий грейд", "currentLevel"],
            ["Целевой грейд", "targetLevel"],
            ["Период с", "periodFrom"],
            ["Период до", "periodTo"],
            ["Руководитель", "manager"]
          ].map(([label, name]) => (
            <TextInput
              key={name}
              label={label}
              name={name}
              value={formData[name]}
              onChange={handleChange}
            />
          ))}

          <Textarea
            label="Общие цели"
            name="goalsGeneral"
            value={formData.goalsGeneral}
            onChange={handleChange}
          />

          <Textarea
            label="Цели по техническим навыкам"
            name="goalsTech"
            value={formData.goalsTech}
            onChange={handleChange}
          />

          <Textarea
            label="Цели по soft-skills"
            name="goalsSoft"
            value={formData.goalsSoft}
            onChange={handleChange}
          />

          <Group justify="flex-end">
            <Button type="submit">Сохранить и экспортировать</Button>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}