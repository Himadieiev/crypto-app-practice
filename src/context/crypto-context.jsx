import { createContext, useContext, useEffect, useState } from 'react';

import { fakeFetchCryptoAssets, fakeFetchCryptoData } from '../api';
import { percentDifference } from '../utils';

const CryptoContext = createContext({
  assets: [],
  crypto: [],
  isLoading: false,
});

// eslint-disable-next-line react/prop-types
export const CryptoContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [crypto, setCrypto] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    async function preload() {
      setIsLoading(true);
      const { result } = await fakeFetchCryptoData();
      const assets = await fakeFetchCryptoAssets();

      setAssets(
        assets.map(asset => {
          const coin = result.find(c => c.id === asset.id);
          return {
            grow: asset.price < coin.price,
            growPercent: percentDifference(asset.price, coin.price),
            totalAmount: asset.amount * coin.price,
            totalProfit: asset.amount * coin.price - asset.amount * asset.price,
            ...asset,
          };
        })
      );
      setCrypto(result);

      setIsLoading(false);
    }
    preload();
  }, []);

  return (
    <CryptoContext.Provider value={{ isLoading, crypto, assets }}>
      {children}
    </CryptoContext.Provider>
  );
};

export default CryptoContext;

export function useCrypto() {
  return useContext(CryptoContext);
}
