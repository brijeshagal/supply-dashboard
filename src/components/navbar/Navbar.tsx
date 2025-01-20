import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => {
  return (
    <div className="px-4 py-2 w-screen flex justify-between items-center">
      <div className="">Dashboard</div>
      <div className="">
        <ConnectButton />
      </div>
    </div>
  );
};

export default Navbar;
