import { cryptoAssets, cryptoData } from './data';

export const fakeFetchCryptoData = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(cryptoData);
    }, 2000);
  });
};

export const fakeFetchCryptoAssets = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(cryptoAssets);
    }, 2000);
  });
};
