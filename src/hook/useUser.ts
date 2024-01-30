import { useState } from 'react';
import btoa from '../utils/btoa';
import useApp from './useApp';
import { User } from '../interface';

export default function useUser() {
  const { app } = useApp();
  const [user, setUser] = useState<User>(app.user);
  const login = () => {
    return app.fetch('user/get').then((data: User) =>
      app.set('user', btoa(data)).then(() =>
        app.syncUser().then((val) => {
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
      return app.set('user', btoa({ uid: user.uid, roles: [] })).then(() =>
        app.syncUser().then((val) => {
          setUser({ ...val });
          return Promise.resolve(true);
        })
      );
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
