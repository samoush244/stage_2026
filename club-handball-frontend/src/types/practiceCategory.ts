export type ScheduleCell = {
  time?: string;
  location?: string;
};

export type ScheduleRow = {
  day: string;
  cells: ScheduleCell[];
};

export type PracticeCategory = {
  _id?: string;
  title: string;
  birthYearsLabel: string;
  logoUrl: string;
  logoPublicId?: string;
  columns: string[];
  rows: ScheduleRow[];
  order: number;
  isActive: boolean;
};