import { useState, type FC } from 'react';
import { GitFork, Layers, ChevronRight, Sparkles } from 'lucide-react';
import type { MindMapNode } from '../types/study';

interface MindMapViewProps {
  rootNode: MindMapNode;
}

export const MindMapView: FC<MindMapViewProps> = ({ rootNode }) => {
  const [selectedNode, setSelectedNode] = useState<MindMapNode>(rootNode);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-stone-200/90 p-5 rounded-3xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2 m-0">
            <GitFork className="w-5 h-5 text-emerald-600" />
            Concept Hierarchy Map
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Visual concept tree to connect, navigate, and remember interconnected ideas
          </p>
        </div>
        <div className="text-xs text-stone-400">
          Click any concept node to inspect details
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mind Map Tree */}
        <div className="lg:col-span-2 bg-[#eef9f2]/70 border border-emerald-100 rounded-3xl p-7 min-h-110 flex flex-col justify-center shadow-xs">
          <div className="space-y-7">
            {/* ROOT NODE */}
            <div className="flex justify-center">
              <button
                onClick={() => setSelectedNode(rootNode)}
                className={`px-5 py-3 rounded-2xl text-xs font-bold shadow-xs transition-all border-2 flex items-center gap-2 ${
                  selectedNode.id === rootNode.id
                    ? 'bg-emerald-600 text-white border-emerald-600 ring-4 ring-emerald-100 scale-102'
                    : 'bg-white text-stone-900 border-emerald-200 hover:border-emerald-400'
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
                  <div key={branch.id} className="space-y-2.5">
                    <button
                      onClick={() => setSelectedNode(branch)}
                      className={`w-full p-3 rounded-xl text-xs font-bold text-left transition border flex items-center justify-between shadow-xs ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-stone-200 bg-white text-stone-900 hover:border-emerald-300'
                      }`}
                    >
                      <span className="truncate">{branch.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    </button>

                    {/* LEAVES (Level 2) */}
                    <div className="space-y-1.5 pl-3 border-l-2 border-emerald-200">
                      {branch.children?.map((leaf) => {
                        const isLeafSelected = selectedNode.id === leaf.id;
                        return (
                          <button
                            key={leaf.id}
                            onClick={() => setSelectedNode(leaf)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition block truncate ${
                              isLeafSelected
                                ? 'bg-emerald-200/80 text-emerald-950 font-bold'
                                : 'text-stone-600 hover:text-stone-900 hover:bg-emerald-50'
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
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <Layers className="w-4 h-4" />
              <span>Concept Inspector</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                {selectedNode.label}
              </h3>
              <p className="text-[11px] text-stone-400 font-mono mt-0.5">
                Node ID: {selectedNode.id}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#f0faf4] border border-emerald-100 text-xs text-stone-700 leading-relaxed">
              <p>
                {selectedNode.description ||
                  `A core component of ${rootNode.label}. Understanding how this concept connects to adjacent principles gives you stronger intuition for exam questions.`}
              </p>
            </div>

            {selectedNode.children && selectedNode.children.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Connected Sub-Topics ({selectedNode.children.length})
                </span>
                <div className="space-y-1.5">
                  {selectedNode.children.map((child) => (
                    <div
                      key={child.id}
                      onClick={() => setSelectedNode(child)}
                      className="text-xs p-2.5 rounded-xl bg-stone-50 hover:bg-emerald-50 border border-stone-200/80 text-stone-800 cursor-pointer flex items-center justify-between transition"
                    >
                      <span className="font-semibold">{child.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-400">
            Click any branch to inspect its conceptual relationship.
          </div>
        </div>
      </div>
    </div>
  );
};
