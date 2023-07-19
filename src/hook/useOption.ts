import useApp from './useApp';
import { useState, useEffect } from 'react';
import { isUndefined, isFunction } from '../utils/is';

interface IProps {
  id: string;
  defaultValue: any;
  disabled?: boolean;
}

export default function useOption(props: IProps) {
  const { id, disabled, defaultValue } = props;
  const { app } = useApp();
  const [value, setValue] = useState(defaultValue);
  const refetch = () => {
    if (disabled) {
      return;
    }
    app.option(id).then((data: any) => {
      data && setValue(data);
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
        .remove(id)
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

  useEffect(refetch, [id]);

  return {
    app,
    value,
    onChange,
    refetch,
  };
}
