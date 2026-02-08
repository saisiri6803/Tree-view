import React, { type DragEvent, useCallback } from 'react';
import TreeNode from './TreeNode';
import { type TreeNode as TreeNodeType, type DragItem} from './types';
import { useTreeData } from '../../hooks/useTreeData';
import './styles.css';
import { MdOutlineAdd } from 'react-icons/md';
import { findNodeById, findParentId, moveNodeToIndex } from '../../utils/treeutils';

interface TreeViewProps {
    data: TreeNodeType[];
}

const TreeView: React.FC<TreeViewProps> = ({ data }) => {
    const {
        treeData,
        setTreeData,
        draggedNode,
        setDraggedNode,
        toggleExpand,
        addNode,
        deleteNode,
        updateNodeName
    } = useTreeData(data);

    const handleDragStart = useCallback((
        e: DragEvent<HTMLDivElement>,
        item: DragItem
    ) => {
        setDraggedNode(item.id);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', item.id);
    }, [setDraggedNode]);

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }, []);

    const handleDrop = useCallback((
        e: DragEvent<HTMLDivElement>,
        targetId: string
    ) => {
        e.preventDefault();
        if (!draggedNode || draggedNode === targetId) return;

        // Compute parentId/index here using findParentId + siblings
        const parentId = findParentId(treeData, targetId);
        const siblings = parentId
            ? findNodeById(treeData, parentId)?.children || []
            : treeData;
        const targetPos = siblings.findIndex(n => n.id === targetId);

        const updated = moveNodeToIndex(treeData, draggedNode, parentId, targetPos + 1);
        setTreeData(updated);
        setDraggedNode(null);
    }, [draggedNode, treeData, setTreeData, setDraggedNode]);



    if (!treeData || treeData.length === 0) {
        return (
            <div className="tree-view empty-state">
                <div className="empty-content">
                    <h3 className="empty-title">No Nodes Yet</h3>
                    <p className="empty-subtitle">
                        Get started by adding your first tree node.
                    </p>

                    <button
                        className="empty-add-btn"
                        onClick={() => {
                            const newRootNode: TreeNodeType = {
                                id: `root-${Date.now()}`,
                                name: 'New Root Node',
                                isExpanded: false,
                                childrenLoaded: false
                            };
                            setTreeData([newRootNode]);
                        }}
                    >
                        <MdOutlineAdd /> Add Node
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="tree-view">
            <div className="tree-header">
                <h1 className="tree-title">
                    Tree View
                </h1>
            </div>
            <div className="tree-container">
                {treeData.map((node) => (
                    <TreeNode
                        key={node.id}
                        node={node}
                        level={0}
                        onToggle={toggleExpand}
                        onAdd={addNode}
                        onDelete={deleteNode}
                        onUpdate={(id, payload) => updateNodeName(id, payload)}
                        draggedNode={draggedNode}
                        setDraggedNode={setDraggedNode}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    />
                ))}
            </div>
        </div>
    );
};

export default TreeView;
