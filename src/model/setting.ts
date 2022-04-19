export enum SettingType {
    Boolean = "Boolean",
    Number = "Number",
    String = "String"
}

export function settingTypeFromString(type: string) {
    switch (type.toLowerCase()) {
        case SettingType.Boolean.toLowerCase():
            return SettingType.Boolean;
        case SettingType.Number.toLowerCase():
            return SettingType.Number;
        default:
            return SettingType.String;
    }
}

export function castValue(value: any, type: SettingType): boolean | number | string {
    switch (type) {
        case SettingType.Boolean:
            return value === "true";
        case SettingType.Number:
            return parseInt(value) as number;
        default:
            return value as string;
    }
}

export class Setting {
    constructor(public name: string, public value: any, public type: SettingType) {
    }

}
