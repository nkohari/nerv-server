interface FanMetricData {
  rpm: number;
  percent: number;
}

export interface MetricData {
  coin: string;
  load: number;
  power: { [sensor: string]: number };
  temps: { [sensor: string]: number };
  clocks: { [sensor: string]: number };
  fans: { [sensor: string]: FanMetricData };
}
