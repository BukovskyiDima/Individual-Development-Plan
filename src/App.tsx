import { useState } from "react";
import { useTranslation } from "react-i18next";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import {
  TextInput,
  Textarea,
  Button,
  Group,
  Title,
  Stack,
  Container,
  Select,
  Text,
  Flex,
} from "@mantine/core";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  getPositionOptions,
  Level,
  levelPeriods,
  competencyMatrix,
} from "@/config";
import { employeeSchema } from "@/validation/employeeSchema";
import type { ZodError, ZodIssue } from "zod";

export default function App() {
  const { t } = useTranslation();

  // Initial form state
  const initialFormState = {
    name: "",
    position: "",
    currentLevel: "",
    targetLevel: "",
    periodFrom: "",
    periodTo: "",
    manager: "",
    goalsGeneral: "",
    goalsTech: "",
    goalsSoft: "",
    minPeriod: "",
  };

  const [formData, setFormData] = useState<{ [key: string]: string }>(
    initialFormState
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Map TechLevel to Level enum
  const techLevelToEnum: Record<string, Level> = {
    Intern: Level.INTERN,
    "Junior -": Level.JUNIOR_MINUS,
    Junior: Level.JUNIOR_EQUAL,
    "Junior +": Level.JUNIOR_PLUS,
    "Middle -": Level.MIDDLE_MINUS,
    Middle: Level.MIDDLE_EQUAL,
    "Middle +": Level.MIDDLE_PLUS,
    "Senior -": Level.SENIOR_MINUS,
  };

  // Extract TechLevel values from competency matrix
  const techLevels = competencyMatrix.CompetencyMatrix.map(
    (item) => item.TechLevel
  );

  // Create options with disabled last element
  const techLevelOptions = techLevels.map((level, index) => ({
    value: level,
    label: level,
    disabled: index === techLevels.length - 1,
  }));

  // Get competency data for selected level
  const getCompetencyData = (level: string) => {
    const competency = competencyMatrix.CompetencyMatrix.find(
      (item) => item.TechLevel === level
    );
    if (!competency) return null;

    const softSkills = [
      competency["Customer Focus"],
      competency["Teamwork / Collaboration"],
      competency["Learning capability"],
      competency["Self-Management"],
      competency["Quality"],
      competency["Project Management"],
      competency["Analytical thinking / Problem Solving"],
      competency["Stress Tolerance"],
    ]
      .filter(Boolean)
      .join("\n\n");

    return {
      englishLevel: competency["English Level"],
      primarySkills:
        competency["Primary Skill/Area of Expertise (Development)"],
      softSkills,
    };
  };

  // Get next level based on current level
  const getNextLevel = (currentLevel: string): string => {
    const currentIndex = techLevels.indexOf(currentLevel);
    if (currentIndex === -1 || currentIndex === techLevels.length - 1) {
      return "";
    }
    return techLevels[currentIndex + 1];
  };

  const validateEmployeeFields = (data: { [key: string]: string }) => {
    try {
      employeeSchema.parse({
        name: data.name,
        manager: data.manager,
        position: data.position,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof Error) {
        const zodError = error as ZodError;
        const newErrors: { [key: string]: string } = {};

        if (zodError.errors) {
          zodError.errors.forEach((err: ZodIssue) => {
            newErrors[err.path[0]] = err.message;
          });
        }

        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string | null) => {
    const newValue = value || "";
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: newValue,
        targetLevel:
          name === "currentLevel" ? getNextLevel(newValue) : prev.targetLevel,
      };

      // Auto-fill competency data when current level is selected
      if (name === "currentLevel" && newValue) {
        const nextLevel = getNextLevel(newValue);
        const competencyData = getCompetencyData(nextLevel);
        if (competencyData) {
          updated.goalsGeneral = competencyData.englishLevel || "";
          updated.goalsTech = competencyData.primarySkills || "";
          updated.goalsSoft = competencyData.softSkills || "";
        }

        // Set minimum period based on current level
        const levelEnum = techLevelToEnum[newValue];
        if (levelEnum && levelPeriods[levelEnum]) {
          updated.minPeriod = `${levelPeriods[levelEnum]} months`;
        } else {
          updated.minPeriod = "";
        }
      }

      return updated;
    });

    // Clear error when user selects a value
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const generateDoc = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: t("documentTitle"),
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            ...Object.entries(formData).map(
              ([key, value]) =>
                new Paragraph({
                  children: [
                    new TextRun({ text: `${key}: ${value}`, size: 24 }),
                  ],
                })
            ),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(
      blob,
      `IPR_${formData.name || "employee"}_${formData.targetLevel}.docx`
    );
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate employee fields before submission
    if (!validateEmployeeFields(formData)) {
      return;
    }

    await generateDoc();
    alert(t("formSubmitted"));
    resetForm(); // Reset form after successful submission
  };

  return (
    <Container py="md">
      <LanguageSwitcher />
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Title order={2}>{t("title")}</Title>

          <TextInput
            label={t("employeeName")}
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder={t("employeeNamePlaceholder")}
            required
          />

          <TextInput
            label={t("manager")}
            name="manager"
            value={formData.manager}
            onChange={handleChange}
            error={errors.manager}
            placeholder={t("managerPlaceholder")}
            required
          />

          <Select
            label={t("position")}
            placeholder={t("selectPosition")}
            data={getPositionOptions(t)}
            value={formData.position}
            onChange={(value) => handleSelectChange("position", value)}
            error={errors.position}
            required
          />

          <Group grow>
            <Select
              label={t("currentLevel")}
              placeholder={t("selectCurrentLevel")}
              data={techLevelOptions}
              value={formData.currentLevel}
              onChange={(value) => handleSelectChange("currentLevel", value)}
            />

            <Select
              label={t("targetLevel")}
              value={formData.targetLevel}
              data={[]}
              disabled={true}
              placeholder={
                formData.currentLevel
                  ? getNextLevel(formData.currentLevel)
                  : t("selectCurrentLevelFirst")
              }
            />
          </Group>

          <Flex gap="xs" align="center">
            <Text size="sm" fw={500}>
              {t("minPeriod")}:
            </Text>
            <Text>{formData.minPeriod}</Text>
          </Flex>

          <Textarea
            label={t("goalsGeneral")}
            name="goalsGeneral"
            value={formData.goalsGeneral}
            onChange={handleChange}
            placeholder={t("goalsGeneralPlaceholder")}
            minRows={4}
            autosize
            maxRows={8}
          />

          <Textarea
            label={t("goalsTech")}
            name="goalsTech"
            value={formData.goalsTech}
            onChange={handleChange}
            placeholder={t("goalsTechPlaceholder")}
            minRows={4}
            autosize
          />

          <Textarea
            label={t("goalsSoft")}
            name="goalsSoft"
            value={formData.goalsSoft}
            onChange={handleChange}
            placeholder={t("goalsSoftPlaceholder")}
            minRows={4}
            autosize
          />

          <Group justify="flex-end">
            <Button type="submit">{t("saveAndExport")}</Button>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}
