import React, { createContext, useContext, useEffect, useState } from "react";

const XRPLEVMContext = createContext();

export const XRPLEVMProvider = ({ children }) => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [currentChainId, setCurrentChainId] = useState(null);
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);

  useEffect(() => {
    const checkMetaMask = async () => {
      if (
        typeof window.ethereum !== "undefined" &&
        window.ethereum.isMetaMask
      ) {
        setIsMetaMaskInstalled(true);
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletConnected(true);
          const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          setCurrentChainId(chainId);
        }
        window.ethereum.on("chainChanged", (chainId) => {
          setCurrentChainId(chainId);
          window.location.reload();
        });
        window.ethereum.on("accountsChanged", (accounts) => {
          setWalletConnected(accounts.length > 0);
        });
      }
    };
    checkMetaMask();
  }, []);

  const connectWallet = async () => {
    if (isMetaMaskInstalled) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletConnected(true);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      window.open("https://metamask.io/download.html", "_blank");
    }
  };

  const addXRPLEVMSidechain = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x160c8e2", // 1440002 in hex
            chainName: "XRPL EVM Sidechain Devnet",
            nativeCurrency: {
              name: "XRP",
              symbol: "XRP",
              decimals: 18,
            },
            rpcUrls: ["https://rpc-evm-sidechain.xrpl.org"],
            blockExplorerUrls: ["https://evm-sidechain.xrpl.org"],
          },
        ],
      });

      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      setCurrentChainId(chainId);
    } catch (error) {
      console.error("Failed to add the XRPL EVM sidechain:", error);
    }
  };

  const toggleNetworkModal = () => {
    setIsNetworkModalOpen(!isNetworkModalOpen);
  };

  const checkIsOnXRPLEVMSidechain = () => {
    return currentChainId === "0x160c8e2"; // 1440002 in hex
  };

  return (
    <XRPLEVMContext.Provider
      value={{
        isMetaMaskInstalled,
        walletConnected,
        currentChainId,
        addXRPLEVMSidechain,
        isNetworkModalOpen,
        setIsNetworkModalOpen,
        connectWallet,
        toggleNetworkModal,
        checkIsOnXRPLEVMSidechain,
      }}
    >
      {children}
    </XRPLEVMContext.Provider>
  );
};

export function useXRPLEVM() {
  return useContext(XRPLEVMContext);
}
