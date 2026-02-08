import {type  TreeNode } from '../components/TreeView/types';

export const initialTreeData: TreeNode[] = [
  {
    id: '1',
    name: 'Documents',
    children: [
      {
        id: '1-1',
        name: 'Work',
        childrenLoaded: false
      },
      {
        id: '1-2',
        name: 'Personal',
        childrenLoaded: false
      }
    ]
  },
  {
    id: '2',
    name: 'Projects',
    childrenLoaded: false
  },
  {
    id: '3',
    name: 'Photos',
    childrenLoaded: false
  }
];

export const simulateApiCall = (delay = 1000): Promise<TreeNode[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'child-1', name: 'Child 1', childrenLoaded: false },
        { id: 'child-2', name: 'Child 2', childrenLoaded: false },
        { id: 'child-3', name: 'Child 3', childrenLoaded: false }
      ]);
    }, delay);
  });
};
