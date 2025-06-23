import { Function } from '@app/shared/models/function';

export const unflatteringForLeftMenu = (functions: Function[]): Function[] => {
  for (const func of functions) {
    if (func.parentId) {
      const parent = functions.filter((x) => x.id === func.parentId).at(0)!;
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
export interface TreeNode<T = any> {
  data: T;
  expanded?: boolean;
  children?: TreeNode<T>[];
}

export interface TreeData {
  id: string;
  parentId: string | null;
  [key: string]: any;
}
export const unflatteringForTree = <T extends TreeData>(arr: T[]): TreeNode<T>[] => {
  const map: Record<string, number> = {};
  const roots: TreeNode<T>[] = [];
  
  // Create tree nodes and initialize map
  const treeNodes: TreeNode<T>[] = arr.map((item, index) => {
    map[item.id] = index;
    return {
      data: item,
      expanded: true,
      children: []
    };
  });

  // Build tree structure
  for (let i = 0; i < treeNodes.length; i++) {
    const node = treeNodes[i];
    const parentId = node.data.parentId;
    
    if (parentId !== null && map[parentId] !== undefined) {
      const parentIndex = map[parentId];
      if (!treeNodes[parentIndex].children) {
        treeNodes[parentIndex].children = [];
      }
      treeNodes[parentIndex].children!.push(node);
    } else {
      roots.push(node);
    }
  }
  
  return roots;
};

export const makeSeoTitle = (input: string) => {
  if (input == undefined || input == '') {
    return '';
  }
  // Đổi chữ hoa thành chữ thường
  let slug = input.toLowerCase();

  // Đổi ký tự có dấu thành không dấu
  slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  slug = slug.replace(/đ/gi, 'd');
  // Xóa các ký tự đặt biệt
  slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
  // Đổi khoảng trắng thành ký tự gạch ngang
  slug = slug.replace(/ /gi, '-');
  // Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
  // Phòng trường hợp người nhập vào quá nhiều ký tự trắng
  slug = slug.replace(/\-\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-/gi, '-');
  slug = slug.replace(/\-\-/gi, '-');
  // Xóa các ký tự gạch ngang ở đầu và cuối
  slug = '@' + slug + '@';
  slug = slug.replace(/\@\-|\-\@|\@/gi, '');

  return slug;
}

export const toFormData = (formValue: any) => {
  const formData = new FormData();
  for (const key of Object.keys(formValue)) {
    const value = formValue[key];
    formData.append(key, value);
  }

  return formData;
}

