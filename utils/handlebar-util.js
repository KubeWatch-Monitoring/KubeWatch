"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpers = void 0;
exports.helpers = {
    section: function (name, options) {
        if (!this.section)
            this.section = {};
        this.section[name] = options.fn(this);
    },
    if_eq: function (a, b, opts) {
        if (a === b)
            return opts.fn(this);
        else
            return opts.inverse(this);
    },
    if_empty: function (array, opts) {
        if (array.length === 0)
            return opts.fn(this);
        else
            return opts.inverse(this);
    },
    not: function (a) {
        return !a;
    },
    use_if_neq_else_negate: function (a, b, returnValue) {
        return a === b ? !returnValue : returnValue;
    },
    formatDate: function (dateStr) {
        if (!dateStr)
            return "";
        const date = new Date(dateStr);
        const currentDate = new Date();
        let timeDiff = Math.round((date.getTime() - currentDate.getTime()) / 1000 / 3600 / 24) + 1;
        let negateTimeDiff = false;
        if (timeDiff < 0) {
            timeDiff *= -1;
            negateTimeDiff = true;
        }
        let unit = "day";
        if (timeDiff >= 30) {
            timeDiff = Math.round(timeDiff / 30);
            unit = "month";
            if (timeDiff >= 12) {
                timeDiff = Math.round(timeDiff / 12);
                unit = "year";
            }
        }
        if (negateTimeDiff)
            timeDiff *= -1;
        const rtf = new Intl.RelativeTimeFormat('en', { style: 'long', numeric: "auto" });
        return rtf.format(timeDiff, unit);
    }
};
//# sourceMappingURL=handlebar-util.js.map