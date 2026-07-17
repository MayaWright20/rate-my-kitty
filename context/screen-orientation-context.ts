import { createContext } from "react";

export type IsScreenPortraitContextProps = boolean | null;

export const IsScreenPortraitContext =
  createContext<IsScreenPortraitContextProps>(null);
