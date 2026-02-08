import React from 'react';
import './App.css';
import TreeView from './components/TreeView/TreeView';
import { initialTreeData } from './data/mockData';

const App: React.FC = () => {
  return (
    <div className="App">
      <TreeView data={initialTreeData} />
    </div>
  );
};

export default App;
