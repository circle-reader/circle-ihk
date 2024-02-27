import { useState } from 'react';
import useApp from './useApp';
import { User } from '../interface';

export default function useUser() {
  const { app } = useApp();
  const [user, setUser] = useState<User>(app.user);
  const login = () => {
    // 先清空 access_token 再登录
    return app.syncUser({ ...app.user, access_token: '' }).then(() =>
      app.fetch('user/get').then((data: User) =>
        app.syncUser(data).then((val) => {
          setUser({ ...val });
          return Promise.resolve(true);
        })
      )
    );
  };

  return {
    app,
    user,
    login,
    logout() {
      return app
        .syncUser({ uid: user.uid, roles: [], access_token: '' })
        .then((val) => {
          setUser({ ...val });
          return Promise.resolve(true);
        });
    },
    regcode(regcode_code: string, mail: string = '') {
      if (!regcode_code) {
        return Promise.reject(app.i18n('exception'));
      }
      return app
        .fetch(app.path('api/user/regcode'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mail,
            regcode_code,
          }),
        })
        .then(login);
    },
  };
}
