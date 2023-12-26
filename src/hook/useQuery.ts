import { useRef, useState, useEffect } from 'react';
import useApp from './useApp';
import { Match } from '../interface';
import { isUndefined, isFunction } from '../utils/is';

interface IProps {
  field?: string;
  keyRange?: any | Array<any>;
  start?: number;
  limit?: number;
  searchIn?: string | Array<string>;
  search?: string;
  order?: 'DESC' | 'ASC';
  match?: Match;
  table?: string;
}

export default function useQuery(props: IProps) {
  const { table = 'node', ...prop } = props;
  const { app, me, container } = useApp();
  const done = useRef(false);
  const [loading, setLoading] = useState(false);
  const [query, onQuery] = useState(prop);
  const [data, setData] = useState<Array<any>>([]);
  const refetch = (callback?: (err?: string) => void) => {
    setLoading(true);
    const { start = 1, limit = 10, ...reset } = query;
    app
      .list(reset, { start, limit }, table)
      .then((results: Array<any> = []) => {
        if (!Array.isArray(results)) {
          return;
        }
        if (results.length <= 0 || results.length < limit) {
          done.current = true;
        }
        if (start <= 1) {
          setData(results);
        } else {
          setData((lastData) => [...lastData, ...results]);
        }
        // @ts-ignore
        isFunction(callback) && callback();
      })
      .catch((err: Error) => {
        // @ts-ignore
        isFunction(callback) && callback(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const onChange = (
    value: any,
    key: string,
    callback?: (error?: string) => void
  ) => {
    if (isUndefined(value)) {
      return;
    }
    app
      .set(value, key, table)
      .then((id: string) => {
        app.get(id, table).then((val: any) => {
          const index = data.findIndex((prop: any) => prop.id === key);
          if (index >= 0) {
            data[index] = val;
          } else {
            data.push(val);
          }
          setData([...data]);
          // @ts-ignore
          isFunction(callback) && callback();
        });
      })
      .catch((err: Error) => {
        // @ts-ignore
        isFunction(callback) && callback(err.message);
      });
  };

  useEffect(refetch, [query]);

  return {
    me,
    app,
    data,
    query,
    onQuery,
    onChange,
    loading,
    refetch,
    container,
  };
}
