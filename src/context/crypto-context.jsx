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

  const mapAssets = (assets, result) => {
    return assets.map(asset => {
      const coin = result.find(c => c.id === asset.id);
      return {
        grow: asset.price < coin.price,
        growPercent: percentDifference(asset.price, coin.price),
        totalAmount: asset.amount * coin.price,
        totalProfit: asset.amount * coin.price - asset.amount * asset.price,
        name: coin.name,
        ...asset,
      };
    });
  };

  useEffect(() => {
    async function preload() {
      setIsLoading(true);
      const { result } = await fakeFetchCryptoData();
      const assets = await fakeFetchCryptoAssets();

      setAssets(mapAssets(assets, result));
      setCrypto(result);

      setIsLoading(false);
    }
    preload();
  }, []);

  const addAsset = newAsset => {
    setAssets(prev => mapAssets([...prev, newAsset], crypto));
  };

  return (
    <CryptoContext.Provider value={{ isLoading, crypto, assets, addAsset }}>
      {children}
    </CryptoContext.Provider>
  );
};

export default CryptoContext;

export function useCrypto() {
  return useContext(CryptoContext);
}
