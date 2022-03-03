import { Request, Response } from "express";

export enum Style {
  Light = "light",
  Dark = "dark",
}

export class Settings {
  constructor(
    public orderBy: Settings.OrderBy,
    public orderAscending: boolean,
    public filterCompleted: boolean
  ) {}
}

export namespace Settings {
  export enum OrderBy {
    Title = "title",
    DueDate = "dueDate",
    CreationDate = "creationDate",
    Importance = "importance",
  }
}

export const sessionUserSettings = (
  req: Request,
  res: Response,
  next: () => void
) => {
  let style = (req.query?.style as Style) || req.session.style;
  if (!style) style = Style.Light;
  req.session.style = style;

  const userSettings = req.session?.display || {
    orderBy: Settings.OrderBy.Title,
    orderAscending: true,
    filterCompleted: true,
  };
  const { orderBy, orderAscending, filterCompleted } = req.query;
  if (orderBy) userSettings.orderBy = orderBy as Settings.OrderBy;
  if (orderAscending) userSettings.orderAscending = orderAscending === "true";
  if (filterCompleted)
    userSettings.filterCompleted = filterCompleted === "true";
  req.session.display = userSettings;

  next();
};
