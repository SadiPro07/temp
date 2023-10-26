/* eslint-disable */ 
import { useEffect } from 'react';
import RequestUserPermission, { NotificatonListner, getDeviceToken } from '../utils/Notificaton';

type useDeviceTokenType = {
  setDeviceToken: (token: string | undefined) => void
}

function useDeviceTokenEffect({setDeviceToken}: useDeviceTokenType) {
  useEffect(() => {
    const FetchToken = async () => {
      const token = await getDeviceToken();
      token && setDeviceToken(token);
      RequestUserPermission();
      NotificatonListner();
    }
    FetchToken();
  }, [setDeviceToken]);
}

export default useDeviceTokenEffect;
