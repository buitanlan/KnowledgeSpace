import { Injectable } from '@angular/core';
import { Function } from '../models/function';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  unflatteringForLeftMenu = (funcs: Function[]): Function[] => {
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
}
