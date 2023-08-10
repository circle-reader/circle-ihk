import { useState } from 'react';
import btoa from '../utils/btoa';
import useApp from './useApp';
import { User } from '../interface';

export default function useUser() {
  const { app } = useApp();
  const [user, setUser] = useState<User>(app.user);
  const getToken = () => {
    return new Promise((resolve, reject) => {
      if (user.token) {
        resolve(user.token);
        return;
      }
      app
        .fetch('user/token.json', {
          method: 'POST',
        })
        .then((data: { token: string }) => {
          app
            .set(
              'user',
              btoa({
                ...user,
                token: data.token,
              })
            )
            .then(() => {
              app.syncUser().then((val) => {
                setUser(val);
                resolve(data.token);
              });
            });
        })
        .catch(reject);
    });
  };
  const sync = () => {
    return getToken()
      .then((token) =>
        app
          .fetch('user/current', {
            headers: {
              'X-CSRF-Token': token,
              'Content-Type': 'application/json',
            },
          })
          .then((current) =>
            Promise.resolve({
              ...current,
              token,
            })
          )
      )
      .then((result) => {
        return app
          .set(
            'user',
            btoa({
              ...user,
              ...result,
            })
          )
          .then(() => {
            return app.syncUser().then((val) => {
              setUser(val);
              return Promise.resolve(true);
            });
          });
      });
  };

  return {
    app,
    user,
    sync,
    // login(
    //   {
    //     username,
    //     password,
    //   }: {
    //     username: string;
    //     password: string;
    //   },
    //   remeberMe?: boolean
    // ) {
    //   return token()
    //     .then((token) => {
    //       return app.fetch('user/login', {
    //         method: 'POST',
    //         headers: {
    //           token: btoa({
    //             username,
    //             password,
    //           }),
    //           'X-CSRF-Token': token,
    //           'Content-Type': 'application/json',
    //         },
    //       });
    //     })
    //     .then((result) => {
    //       const loginData = {
    //         ...result,
    //       };
    //       if (!remeberMe && loginData.auth) {
    //         delete loginData.auth;
    //       }
    //       return app.set('user', btoa(loginData)).then(() => {
    //         return app.syncUser().then((val) => {
    //           setUser(val);
    //           return Promise.resolve(true);
    //         });
    //       });
    //     })
    //     .catch(() => Promise.resolve(false));
    // },
    logout() {
      return getToken().then((token) =>
        app
          .fetch('user/logout.json', {
            method: 'POST',
            headers: {
              'X-CSRF-Token': token,
              'Content-Type': 'application/json',
            },
          })
          .finally(() => {
            return app
              .set('user', btoa({ uid: user.uid, roles: [] }))
              .then(() => {
                return app.syncUser().then((val) => {
                  setUser(val);
                  return Promise.resolve(true);
                });
              });
          })
      );
    },
    // resetPwd(
    //   {
    //     username,
    //     password,
    //     newpassword,
    //   }: {
    //     username: string;
    //     password: string;
    //     newpassword: string;
    //   },
    //   remeberMe?: boolean
    // ) {
    //   return app
    //     .fetch('user/resetpwd', {
    //       method: 'POST',
    //       headers: {
    //         token: btoa({
    //           username,
    //           password,
    //           newpassword,
    //         }),
    //         'Content-Type': 'application/json',
    //       },
    //     })
    //     .then((result) => {
    //       const resetData = {
    //         ...user,
    //       };
    //       if (remeberMe) {
    //         resetData.auth = result.auth;
    //       }
    //       return app.set('user', btoa(resetData)).then(() => {
    //         return app.syncUser().then((val) => {
    //           setUser(val);
    //           return Promise.resolve(true);
    //         });
    //       });
    //     })
    //     .catch(() => Promise.resolve(false));
    // },
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
