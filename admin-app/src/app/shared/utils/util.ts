import { Function } from '@app/shared/models/function';

export const unflatteringForLeftMenu = (funcs: Function[]): Function[] => {
  for (const func of funcs) {
    if (func.parentId) {
      const parent = funcs.filter((x) => x.id === func.parentId)[0];
      if (parent.children) {
        parent.children = [...parent.children, func];
      } else {
        parent.children = [func];
      }
      funcs = funcs.filter((x) => x.id !== func.id);
    }
  }
  return funcs;
};
