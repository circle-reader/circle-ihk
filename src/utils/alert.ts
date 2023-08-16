import { App } from '../interface';

export default function (
  app: App,
  callback?: (grant?: any) => void,
  btnText?: string
) {
  app.get('alert').then((data?: boolean) => {
    if (data) {
      callback && callback();
      return;
    }
    app.fire(
      'notice',
      {
        duration: 5,
        onClose: callback,
        message: app.i18n('alert'),
        btnText: btnText || app.i18n('got_it'),
      },
      () => {
        app.set('alert', true).then(callback);
      }
    );
  });
}
