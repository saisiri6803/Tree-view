import { type TreeNode } from '../components/TreeView/types';


export const findNodeById = (nodes: TreeNode[], id: string): TreeNode | null => {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const updateNodeById = (
  nodes: TreeNode[], 
  id: string, 
  updates: Partial<TreeNode>
): TreeNode[] => {
  return nodes.map(node => {
    if (node.id === id) {
      return { ...node, ...updates };
    }
    if (node.children) {
      return {
        ...node,
        children: updateNodeById(node.children, id, updates)
      };
    }
    return node;
  });
};

export const addChildNode = (
  nodes: TreeNode[], 
  parentId: string, 
  newNode: TreeNode
): TreeNode[] => {
  /**
   * Add new child to parent node and AUTO-EXPAND parent
   */
  return nodes.map(node => {
    if (node.id === parentId) {
      const children = node.children || [];
      return {
        ...node,
        children: [...children, newNode],
        isExpanded: true  // Auto-expand parent
      };
    }
    if (node.children) {
      return {
        ...node,
        children: addChildNode(node.children, parentId, newNode)
      };
    }
    return node;
  });
};

export const deleteNodeById = (nodes: TreeNode[], id: string): TreeNode[] => {
  /**
   * Delete node AND entire subtree recursively
   * Clean up empty children arrays
   */
  return nodes
    .filter(node => node.id !== id)  // Remove target node
    .map(node => {
      if (node.children && node.children.length > 0) {
        const cleanedChildren = deleteNodeById(node.children, id);
        return {
          ...node,
          children: cleanedChildren.length > 0 ? cleanedChildren : undefined
        };
      }
      return node;
    });
};

export const toggleNodeExpansion = (nodes: TreeNode[], id: string): TreeNode[] => {
  /**
   * Toggle isExpanded state of specific node
   */
  const currentNode = findNodeById(nodes, id);
  if (!currentNode) return nodes;
  
  return updateNodeById(nodes, id, {
    isExpanded: !currentNode.isExpanded
  });
};

export const setNodeLoading = (
  nodes: TreeNode[], 
  id: string, 
  isLoading: boolean
): TreeNode[] => {
  /**
   * Set loading state for lazy loading simulation
   */
  return updateNodeById(nodes, id, { isLoading });
};

export const generateUniqueId = (): string => {
  /**
   * Generate unique node ID for new nodes
   */
  return `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const isLeafNode = (node: TreeNode): boolean => {
  /**
   * Check if node has no children
   */
  return !node.children || node.children.length === 0;
};

export const getAllNodeIds = (nodes: TreeNode[]): string[] => {
  /**
   * Get flat array of all node IDs in tree
   */
  const ids: string[] = [];
  const collectIds = (nodeList: TreeNode[]) => {
    nodeList.forEach(node => {
      ids.push(node.id);
      if (node.children) {
        collectIds(node.children);
      }
    });
  };
  collectIds(nodes);
  return ids;
};
