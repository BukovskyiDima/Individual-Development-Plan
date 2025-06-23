import { Position, Level } from "./enums";

export const getPositionOptions = (t: (key: string) => string) => [
  {
    value: Position.TECHNICIAN_PROGRAMMER,
    label: t("positions.technicianProgrammer"),
  },
  {
    value: Position.ENGINEER_PROGRAMMER,
    label: t("positions.engineerProgrammer"),
  },
];

export const getLevelOptions = (t: (key: string) => string) => [
  { value: Level.JUNIOR_MINUS, label: t("levels.juniorMinus") },
  { value: Level.JUNIOR_EQUAL, label: t("levels.juniorEqual") },
  { value: Level.JUNIOR_PLUS, label: t("levels.juniorPlus") },
  { value: Level.MIDDLE_MINUS, label: t("levels.middleMinus") },
  { value: Level.MIDDLE_EQUAL, label: t("levels.middleEqual") },
  { value: Level.MIDDLE_PLUS, label: t("levels.middlePlus") },
  { value: Level.SENIOR_MINUS, label: t("levels.seniorMinus") },
];
