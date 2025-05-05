import { _styles } from "./style";

const styles = _styles;

export const isLoaded = (listObjects: any[]): boolean => listObjects.every((object) => Object.keys(object).length !== 0);
