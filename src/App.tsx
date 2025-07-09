import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  TextInput,
  Button,
  Group,
  Title,
  Stack,
  Container,
  Select,
  Text,
  Flex,
} from "@mantine/core";
import { Level, levelPeriods, competencyMatrix } from "@/config";
import { employeeSchema } from "@/validation/employeeSchema";
import type { ZodError, ZodIssue } from "zod";
import TechGoals from "@/components/TechGoals";
import GoalsSoft from "@/components/SoftGoals/GoalsSoft";
import GeneralGoals from "@/components/GeneralGoals";
import { generateDocPreview } from "@/utils/docGenerator";
import { DocumentPreviewModal } from "@/components/DocumentPreviewModal";

export default function App() {
  const { t } = useTranslation();

  // Initial form state
  const initialFormState: { [key: string]: string | null } = {
    name: "",
    currentLevel: null,
    targetLevel: null,
    manager: "",
    goalsGeneral: "",
    goalsGeneralByLevel: "",
    goalsTech: "",
    goalsTechByLevel: "",
    goalsSoft: "",
    goalsSoftByLevel: "",
    minPeriod: "",
  };

  const [formData, setFormData] = useState<{ [key: string]: string | null }>(
    initialFormState
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [previewOpened, setPreviewOpened] = useState(false);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);

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
  const getNextLevel = (currentLevel: string | null): string | null => {
    if (!currentLevel) return null;
    const currentIndex = techLevels.indexOf(currentLevel);
    if (currentIndex === -1 || currentIndex === techLevels.length - 1) {
      return null;
    }
    return techLevels[currentIndex + 1];
  };

  const validateEmployeeFields = (data: { [key: string]: string | null }) => {
    try {
      employeeSchema.parse({
        name: data.name || "",
        manager: data.manager || "",
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
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
        targetLevel:
          name === "currentLevel" ? getNextLevel(value) : prev.targetLevel,
      };

      // Auto-fill competency data when current level is selected
      if (name === "currentLevel" && value) {
        const nextLevel = getNextLevel(value);
        if (nextLevel) {
          const competencyData = getCompetencyData(nextLevel);
          if (competencyData) {
            updated.goalsGeneralByLevel = competencyData.englishLevel || "";
            updated.goalsTechByLevel = competencyData.primarySkills || "";
            updated.goalsSoftByLevel = competencyData.softSkills || "";
          }
        }

        // Set minimum period based on current level
        const levelEnum = techLevelToEnum[value];
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

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  const isFormValid = () => {
    return formData.name && formData.manager && formData.currentLevel;
  };

  const handlePreview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmployeeFields(formData)) {
      return;
    }

    try {
      const blob = await generateDocPreview({ formData, t });
      setPreviewBlob(blob);
      setPreviewOpened(true);
    } catch (error) {
      console.error("Error generating preview:", error);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpened(false);
    setPreviewBlob(null);
  };

  const handleExport = () => {
    setPreviewOpened(false);
    setPreviewBlob(null);
    resetForm(); // Сбрасываем форму после экспорта
  };

  const getFileName = () => {
    return `IPR_${formData.name || "employee"}_${
      formData.targetLevel || "unknown"
    }.docx`;
  };

  return (
    <Container py="md">
      <form onSubmit={handlePreview}>
        <Stack gap="md">
          <Title order={2}>{t("title")}</Title>

          <TextInput
            label={t("employeeName")}
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            error={errors.name}
            placeholder={t("employeeNamePlaceholder")}
            required
          />

          <TextInput
            label={t("manager")}
            name="manager"
            value={formData.manager || ""}
            onChange={handleChange}
            error={errors.manager}
            placeholder={t("managerPlaceholder")}
            required
          />

          <Group grow>
            <Select
              label={t("currentLevel")}
              placeholder={t("selectCurrentLevel")}
              data={techLevelOptions}
              value={formData.currentLevel}
              onChange={(value) => handleSelectChange("currentLevel", value)}
              required
            />

            <Select
              label={t("targetLevel")}
              value={formData.targetLevel}
              data={[]}
              disabled={true}
              placeholder={
                formData.currentLevel
                  ? getNextLevel(formData.currentLevel) ||
                    t("selectCurrentLevelFirst")
                  : t("selectCurrentLevelFirst")
              }
            />
          </Group>

          {formData.minPeriod && (
            <Flex gap="xs" align="center">
              <Text size="md" fw={500}>
                {t("minPeriod")}:
              </Text>
              <Text>{formData.minPeriod}</Text>
            </Flex>
          )}

          {formData.goalsGeneralByLevel && (
            <GeneralGoals
              defaultValue={formData.goalsGeneralByLevel}
              value={formData.goalsGeneral || ""}
              onChange={handleChange}
            />
          )}

          {formData.goalsSoftByLevel && (
            <GoalsSoft
              defaultValue={formData.goalsSoftByLevel}
              value={formData.goalsSoft || ""}
              onChange={handleChange}
            />
          )}

          {formData.goalsTechByLevel && (
            <TechGoals
              defaultValue={formData.goalsTechByLevel}
              value={formData.goalsTech || ""}
              onChange={handleChange}
            />
          )}

          <Group justify="flex-end">
            <Button type="submit" disabled={!isFormValid()}>
              {t("preview")}
            </Button>
          </Group>
        </Stack>
      </form>

      <DocumentPreviewModal
        opened={previewOpened}
        onClose={handleClosePreview}
        onExport={handleExport}
        previewBlob={previewBlob}
        fileName={getFileName()}
        t={t}
      />
    </Container>
  );
}
