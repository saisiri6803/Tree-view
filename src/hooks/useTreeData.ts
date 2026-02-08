import { useState, useCallback } from 'react';
import { type TreeNode } from '../components/TreeView/types';
import { simulateApiCall } from '../data/mockData';
import { findNodeById, updateNodeById, addChildNode, deleteNodeById } from '../utils/treeutils';
import { moveNodeToIndex } from '../utils/treeutils';


export const useTreeData = (initialData: TreeNode[]) => {
    const [treeData, setTreeData] = useState<TreeNode[]>(initialData);
    const [draggedNode, setDraggedNode] = useState<string | null>(null);

    const updateTreeState = useCallback((updater: (data: TreeNode[]) => TreeNode[]) => {
        setTreeData(prev => updater([...prev]));
    }, []);

    const loadChildren = useCallback(async (nodeId: string) => {
        const node = findNodeById(treeData, nodeId);
        if (!node || node.childrenLoaded || node?.isLoading) return;

        updateTreeState(draft => updateNodeById(draft, nodeId, { isLoading: true }));

        try {
            const children = await simulateApiCall();
            updateTreeState(draft => updateNodeById(draft, nodeId, {
                children,
                isLoading: false,
                childrenLoaded: true,
                isExpanded: true
            }));
        } catch (error) {
            updateTreeState(draft => updateNodeById(draft, nodeId, { isLoading: false }));
            console.log(error)
        }
    }, [treeData, updateTreeState]);

    const toggleExpand = useCallback((nodeId: string) => {
        const node = findNodeById(treeData, nodeId);
        if (!node) return;

        if (!node.childrenLoaded && !node.children) {
            loadChildren(nodeId);
        } else {
            updateTreeState(draft => updateNodeById(draft, nodeId, {
                isExpanded: !node.isExpanded
            }));
        }
    }, [treeData, loadChildren, updateTreeState]);

    const addNode = (parentId: string, name: string) => {
        const newNode: TreeNode = { id: `node-${Date.now()}`, name };
        setTreeData(addChildNode(treeData, parentId, newNode));
    };

    const deleteNode = useCallback((nodeId: string) => {
        setTreeData(prevTreeData => {
            const newTree = deleteNodeById([...prevTreeData], nodeId);
            return newTree;
        });
    }, []);


    const updateNodeName = useCallback((
        nodeId: string,
        payload: { name?: string; isEditing?: boolean }
    ) => {
        updateTreeState(draft => updateNodeById(draft, nodeId, payload));
    }, [updateTreeState]);


    const moveNode = useCallback((
        sourceId: string,
        targetParentId: string | null,
        targetIndex: number
    ) => {
        updateTreeState(draft => moveNodeToIndex(draft, sourceId, targetParentId, targetIndex));
    }, [updateTreeState]);



    return {
        treeData,
        setTreeData,
        draggedNode,
        setDraggedNode,
        toggleExpand,
        addNode,
        deleteNode,
        updateNodeName,
        loadChildren,
        moveNode
    };
};
