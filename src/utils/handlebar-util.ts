import moment from "moment";
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
    formatDate: function(datetime: string, format: string): string {
        return moment(datetime).format(format);
    }
}
