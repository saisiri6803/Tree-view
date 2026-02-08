import React, { useState, useRef, type DragEvent } from 'react';
import type  { TreeNode as TreeNodeType, DragItem } from './types';
import { 
  MdKeyboardArrowDown, 
  MdKeyboardArrowRight, 
  MdAddCircleOutline, 
  MdDeleteOutline,
  MdEdit,
  MdAutorenew 
} from 'react-icons/md';
import './styles.css';

interface TreeNodeProps {
  node: TreeNodeType;
  level: number;
  onToggle: (id: string) => void;
  onAdd: (parentId: string, name: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, payload: { name?: string; isEditing?: boolean }) => void;
  draggedNode: string | null;
  setDraggedNode: (id: string | null) => void;
  onDragStart: (e: DragEvent<HTMLDivElement>, item: DragItem) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>, targetId: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  level,
  onToggle,
  onAdd,
  onDelete,
  onUpdate,
  draggedNode,
  setDraggedNode,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const [showInput, setShowInput] = useState(false);
  const [newNodeName, setNewNodeName] = useState('');
  const [editName, setEditName] = useState('');
  const addInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const handleAddNode = () => {
    if (newNodeName.trim()) {
      onAdd(node.id, newNodeName.trim());
      setNewNodeName('');
      setShowInput(false);
    }
  };

  const handleEditStart = () => {
    setEditName(node.name);
    onUpdate(node.id, { isEditing: true });
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const handleEditSave = () => {
    const trimmedName = editName.trim();
    if (trimmedName && trimmedName !== node.name) {
      onUpdate(node.id, { name: trimmedName, isEditing: false });
    } else {
      onUpdate(node.id, { isEditing: false });
    }
    setEditName('');
  };

  const handleEditCancel = () => {
    onUpdate(node.id, { isEditing: false });
    setEditName('');
  };

  const dragItem: DragItem = { id: node.id, parentId: undefined, depth: level };
  const isDragOver = draggedNode && draggedNode !== node.id;

  return (
    <>
      <div 
        className={`tree-node ${isDragOver ? 'drag-over' : ''}`}
        draggable
        onDragStart={(e) => onDragStart(e, dragItem)}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, node.id)}
      >
        <div className={`node-content ${node.isEditing ? 'editing' : ''}`}>
          
          {node.children || node.childrenLoaded ? (
            <button 
              className="expand-btn"
              onClick={(e) => {
                e.stopPropagation();
                onToggle(node.id);
              }}
              disabled={!!node.isLoading}
              title={node.isLoading ? 'Loading children...' : 'Toggle expand/collapse'}
            >
              {node.isLoading ? (
                <MdAutorenew className="loading" size={20} />
              ) : node.isExpanded ? (
                <MdKeyboardArrowDown size={20} />
              ) : (
                <MdKeyboardArrowRight size={20} />
              )}
            </button>
          ) : (
            <span className="expand-placeholder" />
          )}

          {node.isEditing ? (
            <div className="edit-container">
              <input
                ref={editInputRef}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleEditSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEditSave();
                  if (e.key === 'Escape') handleEditCancel();
                }}
                className="edit-input"
                placeholder="Enter node name"
                autoFocus
              />
            </div>
          ) : (
            <span 
              className="node-name"
              onDoubleClick={handleEditStart}
              title="Double-click to edit or use Edit button"
            >
              {node.name}
            </span>
          )}

          <div className="node-actions">
            <button 
              className="action-btn add-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowInput(true);
                setTimeout(() => addInputRef.current?.focus(), 0);
              }}
              title="Add child node (Ctrl+Enter)"
            >
              <MdAddCircleOutline size={18} />
            </button>

            <button 
              className="action-btn delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Delete "${node.name}" and all its children?`)) {
                  onDelete(node.id);
                }
              }}
              title="Delete this node and children"
            >
              <MdDeleteOutline size={18} />
            </button>

            <button 
              className="action-btn edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleEditStart();
              }}
              title="Edit node name (Enter=Save, Esc=Cancel)"
            >
              <MdEdit size={16} />
            </button>
          </div>
        </div>
      </div>

      {showInput && (
        <div className="add-input-container">
          <input
            ref={addInputRef}
            value={newNodeName}
            onChange={(e) => setNewNodeName(e.target.value)}
            placeholder="Enter new child node name"
            className="add-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newNodeName.trim()) {
                handleAddNode();
              }
              if (e.key === 'Escape') {
                setShowInput(false);
                setNewNodeName('');
              }
            }}
          />
          <button 
            onClick={handleAddNode} 
            disabled={!newNodeName.trim()}
            className="add-confirm-btn"
          >
            Add
          </button>
          <button 
            onClick={() => {
              setShowInput(false);
              setNewNodeName('');
            }}
            className="add-cancel-btn"
          >
            Cancel
          </button>
        </div>
      )}

      {node.isExpanded && node.children && node.children.length > 0 && (
        <div className="children">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onToggle={onToggle}
              onAdd={onAdd}
              onDelete={onDelete}
              onUpdate={onUpdate}
              draggedNode={draggedNode}
              setDraggedNode={setDraggedNode}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default TreeNode;
