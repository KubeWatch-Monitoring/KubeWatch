export const helpers = {
    section: function (this: any, name: string, options: any) {
        if (!this.section) this.section = {};
        this.section[name] = options.fn(this);
    },
    if_eq: function (a: any, b: any, opts: any) {
        if (a === b)
            return opts.fn(this);
        else
            return opts.inverse(this);
    },
    if_empty: function (array: [], opts: any) {
        if (array.length === 0)
            return opts.fn(this);
        else
            return opts.inverse(this);
    },
    not: function(a: boolean): boolean {
        return !a;
    },
    use_if_neq_else_negate: function(a: any, b: any, returnValue: boolean) {
        return a === b ? !returnValue : returnValue;
    },
    formatDate: function (dateStr: string): string {
        if(!dateStr) return "";
        const date = new Date(dateStr);
        const currentDate = new Date();
        let timeDiff = Math.round((date.getTime() - currentDate.getTime()) / 1000 / 3600 / 24) + 1;
        let negateTimeDiff = false;
        if(timeDiff < 0) {
            timeDiff *= -1;
            negateTimeDiff = true;
        }
        let unit: Intl.RelativeTimeFormatUnit = "day";
        if(timeDiff >= 30){
            timeDiff = Math.round(timeDiff / 30);
            unit = "month";

            if(timeDiff >= 12){
                timeDiff = Math.round(timeDiff / 12);
                unit = "year";
            }
        }

        if(negateTimeDiff) timeDiff *= -1;
        const rtf = new Intl.RelativeTimeFormat('en', { style: 'long', numeric: "auto" });
        return rtf.format(timeDiff, unit);
    }
}
