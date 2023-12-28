import { Function } from '@app/shared/models/function';

export const unflatteringForLeftMenu = (functions: Function[]): Function[] => {
  for (const func of functions) {
    if (func.parentId) {
      const parent = functions.filter((x) => x.id === func.parentId)[0];
      if (parent.children) {
        parent.children = [...parent.children, func];
      } else {
        parent.children = [func];
      }
      functions = functions.filter((x) => x.id !== func.id);
    }
  }
  return functions;
};
