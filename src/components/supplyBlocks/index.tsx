import { Block } from "@/types/blocks";
import AaveSupplyBlock from "./aave/AaveSupplyBlock";
import LidoSupplyBlock from "./lido/LidoSupplyBlock";

const SupplyBlock = ({
  removeBlock,
  blockDetails,
}: {
  removeBlock: () => void;
  blockDetails: Block;
}) => {
  switch (blockDetails.title) {
    case "AAVE": {
      return <AaveSupplyBlock onRemove={removeBlock} />;
    }
    case "LIDO": {
      return <LidoSupplyBlock onRemove={removeBlock} />;
    }
    default:
      return null;
  }
};

export default SupplyBlock;
