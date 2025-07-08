import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Textarea, Text, Stack, Title } from "@mantine/core";

interface GeneralGoalsProps {
  defaultValue: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const GeneralGoals: FC<GeneralGoalsProps> = ({
  defaultValue,
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <Stack>
      <Title order={3}>{t("goalsGeneral")}:</Title>
      <Text style={{ whiteSpace: "pre-wrap" }}>{defaultValue}</Text>
      <Textarea
        name="goalsGeneral"
        value={value}
        onChange={onChange}
        placeholder={t("goalsGeneralPlaceholder")}
        minRows={4}
        autosize
        maxRows={8}
      />
    </Stack>
  );
};

export default GeneralGoals;
