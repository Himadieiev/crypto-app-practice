import { Layout, Select, Space, Button, Modal, Drawer } from 'antd';
import { useEffect, useState } from 'react';

import { useCrypto } from '../../context/crypto-context';
import CoinInfoModal from '../CoinInfoModal';
import AddAssetForm from '../AddAssetForm';

const headerStyle = {
  width: '100%',
  textAlign: 'center',
  height: 60,
  padding: '1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const AppHeader = () => {
  const [isSelect, setIsSelect] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [coin, setCoin] = useState(null);
  const { crypto } = useCrypto();

  useEffect(() => {
    const keypress = e => {
      if (e.key === '/') {
        setIsSelect(prev => !prev);
      }
    };

    document.addEventListener('keypress', keypress);

    return () => document.removeEventListener('keypress', keypress);
  }, []);

  const handleSelect = value => {
    setCoin(crypto.find(c => c.id === value));
    setIsModalOpen(true);
  };

  return (
    <Layout.Header style={headerStyle}>
      <Select
        style={{
          width: 250,
        }}
        open={isSelect}
        onSelect={handleSelect}
        onClick={() => setIsSelect(prev => !prev)}
        value="press / to open"
        options={crypto.map(coin => ({ label: coin.name, value: coin.id, icon: coin.icon }))}
        optionRender={option => (
          <Space>
            <img style={{ width: 20 }} src={option.data.icon} alt={option.data.label} />{' '}
            {option.data.label}
          </Space>
        )}
      />

      <Button type="primary" onClick={() => setIsDrawerOpen(true)}>
        Add Asset
      </Button>

      <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <CoinInfoModal coin={coin} />
      </Modal>

      <Drawer
        width={600}
        title="Add Asset"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        destroyOnClose
      >
        <AddAssetForm onClose={() => setIsDrawerOpen(false)} />
      </Drawer>
    </Layout.Header>
  );
};

export default AppHeader;
