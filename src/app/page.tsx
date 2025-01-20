"use client";

import SupplyBlock from "@/components/supplyBlocks";
// BlocksGrid.tsx
import { Button } from "@/components/ui/button";
import { Block, BlockType } from "@/types/blocks";
import React, { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

const BlocksGrid: React.FC = () => {
  // Initialize state from localStorage or default
  const [blocks, setBlocks] = useState<Block[]>([
    { id: "block-2", title: "LIDO", content: "LIDO Block" },
    { id: "block-3", title: "AAVE", content: "AAVE Block" },
  ]);

  const handleDragEnd = (result: DropResult): void => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setBlocks(items);
  };

  const addBlock = (type: BlockType): void => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      title: type,
      content: `${type} Block`,
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string): void => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  return (
    <div className="p-4 mx-auto">
      <div className="mb-4 space-x-2">
        {/* <Button onClick={() => addBlock("Odos")}>Add Odos</Button> */}
        <Button onClick={() => addBlock("LIDO")}>Add LIDO</Button>
        <Button onClick={() => addBlock("AAVE")}>Add AAVE</Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          isCombineEnabled={false}
          ignoreContainerClipping={false}
          isDropDisabled={false}
          droppableId="blocks"
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {blocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <SupplyBlock
                        blockDetails={block}
                        removeBlock={() => removeBlock(block.id)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default BlocksGrid;
