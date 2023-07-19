import md5 from 'crypto-js/md5';
import { useState } from 'react';
import btoa from '../utils/btoa';
import useApp from './useApp';
import { User } from '../interface';

export default function useUser() {
  const { app } = useApp();
  const [user, setUser] = useState<User>(app.user);
  const token = () => {
    return new Promise((resolve, reject) => {
      if (user.token) {
        resolve(user.token);
        return;
      }
      app
        .fetch(app.path('session/token'), { format: 'text' })
        .then((token: string) => {
          app
            .set(
              'user',
              btoa({
                ...user,
                token,
              })
            )
            .then(() => {
              app.syncUser().then((val) => {
                setUser(val);
                resolve(token);
              });
            });
        })
        .catch(reject);
    });
  };
  const sync = () => {
    return token()
      .then((token) => {
        return app.fetch(app.path('api/user/current'), {
          method: 'GET',
          headers: {
            'X-CSRF-Token': token,
            'Content-Type': 'application/json',
          },
        });
      })
      .then((result) => {
        return app
          .set(
            'user',
            btoa({
              ...user,
              ...result,
              member: result && result.roles && result.roles.includes('member'),
            })
          )
          .then(() => {
            return app.syncUser().then((val) => {
              setUser(val);
              return Promise.resolve(true);
            });
          });
      })
      .catch(() => {
        if (user.auth) {
          return app
            .fetch(app.path('api/new_token'), {
              format: 'text',
              body: JSON.stringify({
                token: user.auth,
              }),
            })
            .then((token: string) => {
              return app
                .set(
                  'user',
                  btoa({
                    ...user,
                    token,
                  })
                )
                .then(() => {
                  return app.syncUser().then((val) => {
                    setUser(val);
                    return Promise.resolve(true);
                  });
                });
            });
        }
        return Promise.resolve(false);
      });
  };

  return {
    app,
    user,
    sync,
    login(
      {
        username,
        password,
      }: {
        username: string;
        password: string;
      },
      remeberMe?: boolean
    ) {
      return token()
        .then((token) => {
          return app.fetch(app.path('api/user/login'), {
            method: 'POST',
            body: JSON.stringify({
              username,
              password,
            }),
            headers: {
              'X-CSRF-Token': token,
              'Content-Type': 'application/json',
            },
          });
        })
        .then((result) => {
          const loginData = {
            ...result,
            member: result && result.roles && result.roles.includes('member'),
          };
          if (remeberMe) {
            loginData.auth = md5(`${username}_${password}`);
          }
          return app.set('user', btoa(loginData)).then(() => {
            return app.syncUser().then((val) => {
              setUser(val);
              return Promise.resolve(true);
            });
          });
        })
        .catch(() => Promise.resolve(false));
    },
    logout() {
      return token().then((token) =>
        app
          .fetch(app.path('api/user/logout.json'), {
            method: 'POST',
            headers: {
              'X-CSRF-Token': token,
              'Content-Type': 'application/json',
            },
          })
          .finally(() => {
            return app.set('user', btoa({ uid: user.uid })).then(() => {
              return app.syncUser().then((val) => {
                setUser(val);
                return Promise.resolve(true);
              });
            });
          })
      );
    },
    reset(
      {
        username,
        password,
        newpassword,
      }: {
        username: string;
        password: string;
        newpassword: string;
      },
      remeberMe?: boolean
    ) {
      return token()
        .then((token) => {
          return app.fetch(app.path('api/user/resetpwd'), {
            method: 'POST',
            body: JSON.stringify({
              username,
              password,
              newpassword,
            }),
            headers: {
              'X-CSRF-Token': token,
              'Content-Type': 'application/json',
            },
          });
        })
        .then((result) => {
          const resetData = {
            ...user,
            ...result,
            member: result && result.roles && result.roles.includes('member'),
          };
          if (remeberMe) {
            resetData.auth = md5(`${username}_${newpassword}`);
          }
          return app.set('user', btoa(resetData)).then(() => {
            return app.syncUser().then((val) => {
              setUser(val);
              return Promise.resolve(true);
            });
          });
        })
        .catch(() => Promise.resolve(false));
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
        .then(sync);
    },
  };
}
