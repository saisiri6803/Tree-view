export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  isExpanded?: boolean;
  isLoading?: boolean;
  isEditing?: boolean;
  childrenLoaded?: boolean;
}

export type DragItem = {
  id: string;
  parentId?: string;
  depth: number;
};

export type DropTarget = {
  id: string;
  parentId?: string;
  index: number;
  type: 'above' | 'below' | 'inside';
};

export type TreeViewProps = {
  data: TreeNode[];
  onNodeAdd?: (node: TreeNode, parentId?: string) => void;
  onNodeDelete?: (nodeId: string) => void;
  onNodeUpdate?: (nodeId: string, newName: string) => void;
};
