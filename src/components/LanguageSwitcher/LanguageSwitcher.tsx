import { useTranslation } from "react-i18next";
import { SegmentedControl, Group } from "@mantine/core";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Group justify="flex-end" mb="md">
      <SegmentedControl
        value={i18n.language}
        onChange={changeLanguage}
        data={[
          { label: "RU", value: "ru" },
          { label: "EN", value: "en" },
        ]}
        size="xs"
      />
    </Group>
  );
};
