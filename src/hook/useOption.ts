import useApp from './useApp';
import { useState, useEffect } from 'react';
import { isUndefined, isFunction } from '../utils/is';

interface IProps {
  id?: string;
  defaultValue: any;
  disabled?: boolean;
}

export default function useOption(props: IProps) {
  const { id, disabled, defaultValue } = props;
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
    let fieldToListen = `${id}_option`;
    if (!id || id === 'option') {
      fieldToListen = `${me.id}_option`;
    } else if (id === 'display') {
      fieldToListen = `${me.id}_display_${
        app.colorScheme.value ? app.colorScheme.value + '_' : ''
      }option`;
    }
    return app.on(fieldToListen, refetch);
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
