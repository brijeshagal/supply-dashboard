export default function useLido() {
  async function stakeEth() {
    const lidoSDK = new LidoSDK({
      chainId: 17000,
      rpcUrls: ["<RPC_URL>"],
      web3Provider: provider,
    });

    // Views
    const balanceETH = await lidoSDK.core.balanceETH(address);

    // Calls
    const stakeTx = await lidoSDK.stake.stakeEth({
      value,
      callback,
      referralAddress,
      account,
    });

    // relevant results are returned with transaction
    const { stethReceived, sharesReceived } = stakeTx.result;

    console.log(balanceETH.toString(), "ETH balance");
  }
}
