import { useState, type FC } from 'react';
import { GitFork, Layers, ChevronRight } from 'lucide-react';
import type { MindMapNode } from '../types/study';

interface MindMapViewProps {
  rootNode: MindMapNode;
}

export const MindMapView: FC<MindMapViewProps> = ({ rootNode }) => {
  const [selectedNode, setSelectedNode] = useState<MindMapNode>(rootNode);

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#faf7f0] border border-[#ded8cb] p-4 rounded-xl shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#26221f] tracking-tight flex items-center gap-2 m-0">
            <GitFork className="w-4 h-4 text-[#5c534a]" />
            Concept Hierarchy Map
          </h2>
          <p className="text-xs text-[#7d7368] mt-0.5">
            Overview of core topics, dependencies, and mechanisms
          </p>
        </div>
        <div className="text-xs text-[#8a8074]">
          Click any concept to view details
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Mind Map Tree */}
        <div className="lg:col-span-2 bg-[#eae4d7] border border-[#ded8cb] rounded-xl p-6 min-h-100 flex flex-col justify-center shadow-xs">
          <div className="space-y-6">
            {/* ROOT NODE */}
            <div className="flex justify-center">
              <button
                onClick={() => setSelectedNode(rootNode)}
                className={`px-4 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-all border ${
                  selectedNode.id === rootNode.id
                    ? 'bg-[#26221f] text-[#faf7f0] border-[#26221f] ring-2 ring-[#b8ad9b]'
                    : 'bg-[#faf7f0] text-[#26221f] border-[#ded8cb] hover:border-[#b8ad9b]'
                }`}
              >
                {rootNode.label}
              </button>
            </div>

            {/* BRANCHES (Level 1) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {rootNode.children?.map((branch) => {
                const isSelected = selectedNode.id === branch.id;
                return (
                  <div key={branch.id} className="space-y-2">
                    <button
                      onClick={() => setSelectedNode(branch)}
                      className={`w-full p-2.5 rounded-lg text-xs font-semibold text-left transition border flex items-center justify-between ${
                        isSelected
                          ? 'border-[#26221f] bg-[#26221f] text-[#faf7f0]'
                          : 'border-[#ded8cb] bg-[#faf7f0] text-[#26221f] hover:border-[#b8ad9b]'
                      }`}
                    >
                      <span className="truncate">{branch.label}</span>
                      <ChevronRight className="w-3 h-3 text-[#7d7368] shrink-0" />
                    </button>

                    {/* LEAVES (Level 2) */}
                    <div className="space-y-1 pl-2.5 border-l border-[#cfc6b6]">
                      {branch.children?.map((leaf) => {
                        const isLeafSelected = selectedNode.id === leaf.id;
                        return (
                          <button
                            key={leaf.id}
                            onClick={() => setSelectedNode(leaf)}
                            className={`w-full text-left px-2 py-1 rounded text-[11px] transition block truncate ${
                              isLeafSelected
                                ? 'bg-[#ded8cb] text-[#26221f] font-semibold'
                                : 'text-[#5c534a] hover:text-[#26221f] hover:bg-[#ded8cb]/60'
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
        <div className="bg-[#faf7f0] border border-[#ded8cb] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8a8074]">
              <Layers className="w-3.5 h-3.5" />
              <span>Selected Node</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#26221f] tracking-tight">
                {selectedNode.label}
              </h3>
              <p className="text-[11px] text-[#8a8074] font-mono mt-0.5">
                ID: {selectedNode.id}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#f4f0e6] border border-[#ded8cb] text-xs text-[#474039] leading-relaxed">
              <p>
                {selectedNode.description ||
                  `A fundamental component of ${rootNode.label}. Understanding how this concept connects to adjacent ideas gives you a stronger grasp for exam questions.`}
              </p>
            </div>

            {selectedNode.children && selectedNode.children.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-[#7d7368] uppercase tracking-wider">
                  Sub-topics ({selectedNode.children.length})
                </span>
                <div className="space-y-1">
                  {selectedNode.children.map((child) => (
                    <div
                      key={child.id}
                      onClick={() => setSelectedNode(child)}
                      className="text-xs p-2 rounded-lg bg-[#eae4d7] hover:bg-[#dfd8ca] border border-[#ded8cb] text-[#26221f] cursor-pointer flex items-center justify-between transition"
                    >
                      <span>{child.label}</span>
                      <ChevronRight className="w-3 h-3 text-[#7d7368]" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#ded8cb] text-[11px] text-[#8a8074]">
            Click any branch to inspect its connections.
          </div>
        </div>
      </div>
    </div>
  );
};
