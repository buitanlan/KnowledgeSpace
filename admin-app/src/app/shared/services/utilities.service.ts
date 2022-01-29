import { Injectable } from '@angular/core';
import { Function } from "../models/function";


@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

    unflatteringForLeftMenu = (functions: any[]): any[] => {
        const map = {} as any;
        const roots: any[] = [];
        for (let i = 0; i < functions.length; i++) {
            const node = functions[i];
            node.children = [];
            map[node.id] = i; // use map to look-up the parents
            if (node.parentId) {
                delete node['children'];
                functions[map[node.parentId]].children.push(node);
            } else {
                roots.push(node);
            }
        }
        return roots;
    }
}
