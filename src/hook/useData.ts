import useApp from './useApp';
import { useState, useEffect } from 'react';
import { isUndefined, isFunction } from '../utils/is';

interface IProps {
  id: string;
  table?: string;
  defaultValue: any;
  disabled?: boolean;
}

export default function useData(props: IProps) {
  const { id, table = 'option', disabled, defaultValue } = props;
  const { app, me, container } = useApp();
  const [value, setValue] = useState(defaultValue);
  const refetch = () => {
    if (disabled) {
      return;
    }
    app.get(id, table).then((data: any) => {
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
    // 等于默认值直接删除，减小存储大小
    if (value === defaultValue) {
      app
        .remove(id, table)
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
      return;
    }
    app
      .set(id, value, table)
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

  useEffect(refetch, [id]);

  return {
    me,
    app,
    value,
    onChange,
    refetch,
    container,
  };
}
