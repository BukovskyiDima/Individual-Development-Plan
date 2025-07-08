import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Textarea, Text, Stack, Title } from "@mantine/core";

interface GoalsSoftProps {
  defaultValue: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const GoalsSoft: FC<GoalsSoftProps> = ({ defaultValue, value, onChange }) => {
  const { t } = useTranslation();

  return (
    <Stack>
      <Title order={3}>{t("goalsSoft")}:</Title>
      <Text style={{ whiteSpace: "pre-wrap" }}>{defaultValue}</Text>
      <Textarea
        name="goalsSoft"
        value={value}
        onChange={onChange}
        placeholder={t("goalsSoftPlaceholder")}
        minRows={4}
        autosize
      />
    </Stack>
  );
};

export default GoalsSoft;
