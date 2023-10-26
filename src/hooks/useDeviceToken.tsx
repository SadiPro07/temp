/* eslint-disable */ 
import { useEffect } from 'react';
import RequestUserPermission,  { NotificatonListner, getDeviceToken } from '../utils/Notificaton';

function useDeviceTokenEffect(setDeviceToken) {
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
