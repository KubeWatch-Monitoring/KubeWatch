"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionUserSettings = exports.Settings = exports.Style = void 0;
var Style;
(function (Style) {
    Style["Light"] = "light";
    Style["Dark"] = "dark";
})(Style = exports.Style || (exports.Style = {}));
class Settings {
    constructor(orderBy, orderAscending, filterCompleted) {
        this.orderBy = orderBy;
        this.orderAscending = orderAscending;
        this.filterCompleted = filterCompleted;
    }
}
exports.Settings = Settings;
(function (Settings) {
    let OrderBy;
    (function (OrderBy) {
        OrderBy["Title"] = "title";
        OrderBy["DueDate"] = "dueDate";
        OrderBy["CreationDate"] = "creationDate";
        OrderBy["Importance"] = "importance";
    })(OrderBy = Settings.OrderBy || (Settings.OrderBy = {}));
})(Settings = exports.Settings || (exports.Settings = {}));
const sessionUserSettings = (req, res, next) => {
    let style = req.query?.style || req.session.style;
    if (!style)
        style = Style.Light;
    req.session.style = style;
    const userSettings = req.session?.display || {
        orderBy: Settings.OrderBy.Title,
        orderAscending: true,
        filterCompleted: true,
    };
    const { orderBy, orderAscending, filterCompleted } = req.query;
    if (orderBy)
        userSettings.orderBy = orderBy;
    if (orderAscending)
        userSettings.orderAscending = orderAscending === "true";
    if (filterCompleted)
        userSettings.filterCompleted = filterCompleted === "true";
    req.session.display = userSettings;
    next();
};
exports.sessionUserSettings = sessionUserSettings;
//# sourceMappingURL=session-middleware.index.js.map