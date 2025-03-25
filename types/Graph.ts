export type Graph = {
    id: string;
    title: string;
    emoji: string;
    colorIdx: number;
    data?: [number, number][];
    settings?: Partial<GraphSettings>;
    createdAt: string;
};

export type GraphSettings = {
  showPoints: boolean;
  smoothLine: boolean;
  xAxisLabel: string;
  yAxisLabel: string;
  minimumYValue: number;
  maximumYValue: number;
  YInterval: number;
  decimalPlaces: number;
  grid: boolean
};
  