import { useState, type FC } from 'react';
import { GitFork, Layers, Info, ChevronRight, Sparkles } from 'lucide-react';
import type { MindMapNode } from '../types/study';

interface MindMapViewProps {
  rootNode: MindMapNode;
}

export const MindMapView: FC<MindMapViewProps> = ({ rootNode }) => {
  const [selectedNode, setSelectedNode] = useState<MindMapNode>(rootNode);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 m-0">
            <GitFork className="w-5 h-5 text-indigo-500" />
            Concept Knowledge Graph
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Hierarchical mapping of core themes, dependencies, and mechanisms
          </p>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          <span>Click any node to inspect details</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mind Map Tree Visualizer */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 min-h-115 flex flex-col justify-center relative overflow-hidden shadow-2xl">
          {/* Subtle background grid */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          <div className="relative z-10 space-y-8">
            {/* ROOT NODE */}
            <div className="flex justify-center">
              <button
                onClick={() => setSelectedNode(rootNode)}
                className={`px-5 py-3 rounded-2xl font-bold text-sm text-white shadow-xl transition-all border-2 flex items-center gap-2 ${
                  selectedNode.id === rootNode.id
                    ? 'ring-4 ring-indigo-500/40 border-indigo-400 bg-indigo-600 scale-105'
                    : 'border-indigo-500/50 bg-indigo-900/80 hover:bg-indigo-800'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{rootNode.label}</span>
              </button>
            </div>

            {/* BRANCHES (Level 1) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {rootNode.children?.map((branch) => {
                const isSelected = selectedNode.id === branch.id;
                return (
                  <div key={branch.id} className="space-y-3">
                    <button
                      onClick={() => setSelectedNode(branch)}
                      className={`w-full p-3.5 rounded-xl text-xs font-bold text-left transition-all border flex items-center justify-between shadow-md ${
                        isSelected
                          ? 'border-indigo-400 bg-indigo-950 text-white ring-2 ring-indigo-500/50'
                          : 'border-slate-800 bg-slate-900/90 text-slate-200 hover:border-slate-700 hover:bg-slate-800'
                      }`}
                      style={{ borderLeftColor: branch.color || '#6366f1', borderLeftWidth: '4px' }}
                    >
                      <span className="truncate">{branch.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    </button>

                    {/* LEAVES (Level 2) */}
                    <div className="space-y-1.5 pl-3 border-l-2 border-slate-800/80">
                      {branch.children?.map((leaf) => {
                        const isLeafSelected = selectedNode.id === leaf.id;
                        return (
                          <button
                            key={leaf.id}
                            onClick={() => setSelectedNode(leaf)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition block truncate ${
                              isLeafSelected
                                ? 'bg-indigo-600 text-white font-semibold'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                            }`}
                          >
                            • {leaf.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Node Inspector Drawer */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Layers className="w-4 h-4" />
              <span>Concept Inspector</span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {selectedNode.label}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Node ID: <code className="font-mono">{selectedNode.id}</code>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <p className="font-medium">
                {selectedNode.description ||
                  `This represents an essential component of ${rootNode.label}. Understanding its relationship to adjacent concepts provides deep contextual intuition for exams and real-world implementation.`}
              </p>
            </div>

            {selectedNode.children && selectedNode.children.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Connected Sub-Topics ({selectedNode.children.length})
                </span>
                <div className="space-y-1">
                  {selectedNode.children.map((child) => (
                    <div
                      key={child.id}
                      onClick={() => setSelectedNode(child)}
                      className="text-xs p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 cursor-pointer flex items-center justify-between transition"
                    >
                      <span>{child.label}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
            Interactive cognitive graph built for holistic conceptual understanding.
          </div>
        </div>
      </div>
    </div>
  );
};
