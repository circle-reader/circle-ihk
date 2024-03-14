import useApp from './useApp';
import { useState, useEffect } from 'react';
import { isUndefined, isFunction } from '../utils/is';

interface IProps {
  id?: string;
  defaultValue: any;
  disabled?: boolean;
  fieldToListen?: string;
}

export default function useOption(props: IProps) {
  const { id, disabled, defaultValue, fieldToListen } = props;
  const { app, me, container } = useApp();
  const [value, setValue] = useState(defaultValue);
  const refetch = () => {
    if (disabled) {
      return;
    }
    app.option(id).then((data: any) => {
      !isUndefined(data) && setValue(data);
    });
  };
  const onChange = (value: any, callback?: (error?: string) => void) => {
    if (disabled) {
      return;
    }
    if (isUndefined(value)) {
      return;
    }
    app
      .option(id, value)
      .then(() => {
        setValue(value);
        // @ts-ignore
        isFunction(callback) && callback();
      })
      .catch((error: Error) => {
        console.error(error);
        // @ts-ignore
        isFunction(callback) && callback(error.message);
      });
  };

  useEffect(() => {
    return app.on('tab_activated', (visible: Boolean) => {
      visible && refetch();
    });
  }, []);

  useEffect(() => {
    refetch();
    let fieldToListenValue = '';
    if (fieldToListen) {
      fieldToListenValue = fieldToListen;
    } else {
      if (!id || id === 'option') {
        fieldToListenValue = `${me.id}_option`;
      } else if (id === 'display') {
        fieldToListenValue = `${me.id}_display_${
          app.colorScheme.value ? app.colorScheme.value + '_' : ''
        }option`;
      } else {
        fieldToListenValue = `${id}_option`;
      }
    }
    const hooks: Array<() => void> = [];
    hooks.push(app.on(fieldToListenValue, refetch));
    hooks.push(app.on('color_scheme', refetch));
    return () => {
      hooks.forEach((hook) => {
        hook();
      });
    };
  }, [id]);

  return {
    me,
    app,
    value,
    refetch,
    setValue,
    onChange,
    container,
  };
}
