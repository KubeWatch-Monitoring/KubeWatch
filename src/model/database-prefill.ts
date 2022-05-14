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
                "CPU Usage (Seconds)",
                "sum by (pod) (container_cpu_system_seconds_total{namespace!~\"kube-system|monitoring|kubernetes-dashboard\", pod!~\"\"})",
                -1 * 60 * 60 * 1000,
                0,
                5000,
                undefined
            ),
            new ChartSetting(
                "Memory Usage (Bytes)",
                "sum by (pod) (container_memory_usage_bytes{namespace!~\"kube-system|monitoring|kubernetes-dashboard\", pod!~\"\"})",
                -1 * 60 * 60 * 1000,
                0,
                5000,
                undefined
            ),
            new ChartSetting(
                "Disk Usage (Bytes)",
                "sum by (pod) (container_fs_usage_bytes{namespace!~\"kube-system|monitoring|kubernetes-dashboard\", pod!~\"\"})",
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
