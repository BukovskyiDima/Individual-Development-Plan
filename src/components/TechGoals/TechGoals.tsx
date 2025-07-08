import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Stack, Textarea, Text, Title } from "@mantine/core";

interface TechGoalsProps {
  defaultValue: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TechGoals: FC<TechGoalsProps> = ({ defaultValue, value, onChange }) => {
  const { t } = useTranslation();

  return (
    <Stack>
      <Title order={3}>{t("goalsTech")}:</Title>
      <Text style={{ whiteSpace: "pre-wrap" }}>{defaultValue}</Text>
      <Textarea
        name="goalsTech"
        value={value}
        onChange={onChange}
        placeholder={t("goalsTechPlaceholder")}
        minRows={4}
        autosize
      />
    </Stack>
  );
};

export default TechGoals;
