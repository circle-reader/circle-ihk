import useApp from './useApp';
import { useState, useEffect } from 'react';
import { isUndefined, isFunction, isObject } from '../utils/is';

interface IProps {
  id: string;
  defaultValue: any;
  disabled?: boolean;
  monitorFields?: boolean; // 配合 setting 实现设置后实时更新
}

export default function useOption(props: IProps) {
  const { id, disabled, defaultValue, monitorFields = true } = props;
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

  useEffect(refetch, [id]);

  useEffect(() => {
    if (!monitorFields || !isObject(defaultValue)) {
      return;
    }
    const keysToMonitor = Object.keys(defaultValue);
    if (keysToMonitor.length <= 0) {
      return;
    }
    const hooksToMonitor: Array<() => void> = [];
    keysToMonitor.forEach((key) => {
      hooksToMonitor.push(
        app.on(
          `${['option', 'display'].includes(id) ? me.id : id}_${key}`,
          refetch
        )
      );
    });
    return () => {
      if (hooksToMonitor.length <= 0) {
        return;
      }
      hooksToMonitor.forEach((hookToMonitor) => {
        hookToMonitor();
      });
    };
  }, [me.id, monitorFields, defaultValue, refetch]);

  return {
    me,
    app,
    value,
    refetch,
    onChange,
    container,
  };
}
