import {Setting, SettingType} from "./setting";
import {ChartSetting} from "./chart-setting";

export interface DatabasePrefill {
    getSettings(): Setting[];
    getChartSettings(): ChartSetting[];
}

export class DatabasePrefillImpl implements DatabasePrefill {
    getChartSettings(): ChartSetting[] {
        return [
            new ChartSetting(
                "CPU utilisation in %",
                "sum(irate(container_cpu_usage_seconds_total{container!=\"POD\",image!=\"\",id=~\"/kubepods.*\"}[5m])) / scalar(sum(machine_cpu_cores)) * 100",
                -1 * 60 * 60 * 1000,
                0,
                5000,
                undefined
            ),
            new ChartSetting(
                "CPU utilisation in % per Pod",
                "sum by (pod) (irate(container_cpu_usage_seconds_total{container!=\"POD\",image!=\"\",id=~\"/kubepods.*\"}[5m])) / scalar(sum(machine_cpu_cores)) * 100",
                -1 * 60 * 60 * 1000,
                0,
                5000,
                undefined
            ),
            new ChartSetting(
                "Memory utilisation in %",
                "sum(container_memory_working_set_bytes{container!=\"POD\",container!=\"\",id=~\"/kubepods.*\"}) / scalar(sum(machine_memory_bytes)) * 100",
                -1 * 60 * 60 * 1000,
                0,
                5000,
                undefined
            ),
            new ChartSetting(
                "Memory utilisation in % per Pod",
                "sum by (pod) (container_memory_working_set_bytes{container!=\"POD\",container!=\"\",id=~\"/kubepods.*\"}) / scalar(sum(machine_memory_bytes)) * 100",
                -1 * 60 * 60 * 1000,
                0,
                5000,
                undefined
            ),
            new ChartSetting(
                "Number of ready nodes",
                "sum (kube_node_status_condition{condition=\"Ready\", status=\"true\"}==1)",
                -1 * 60 * 60 * 1000,
                0,
                5000,
                undefined
            ),
        ]
    }

    getSettings(): Setting[] {
        return [
            new Setting(
                "isNotificationEnabled",
                true,
                SettingType.Boolean
            )
        ];
    }
}
