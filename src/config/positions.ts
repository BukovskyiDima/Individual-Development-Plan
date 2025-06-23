export enum Position {
  TECHNICIAN_PROGRAMMER = "technicianProgrammer",
  ENGINEER_PROGRAMMER = "engineerProgrammer",
}

export enum Level {
  INTERN = "intern",
  JUNIOR_MINUS = "juniorMinus",
  JUNIOR_EQUAL = "juniorEqual",
  JUNIOR_PLUS = "juniorPlus",
  MIDDLE_MINUS = "middleMinus",
  MIDDLE_EQUAL = "middleEqual",
  MIDDLE_PLUS = "middlePlus",
  SENIOR_MINUS = "seniorMinus",
}

export const levelPeriods = {
  [Level.INTERN]: 3,
  [Level.JUNIOR_MINUS]: 3,
  [Level.JUNIOR_EQUAL]: 3,
  [Level.JUNIOR_PLUS]: 6,
  [Level.MIDDLE_MINUS]: 9,
  [Level.MIDDLE_EQUAL]: 9,
  [Level.MIDDLE_PLUS]: 12,
  [Level.SENIOR_MINUS]: 12,
};

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
