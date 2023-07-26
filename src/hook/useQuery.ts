import { useRef, useState, useEffect } from 'react';
import useApp from './useApp';
import { Match, Pager } from '../interface';
import { isUndefined, isFunction } from '../utils/is';

interface IProps extends Pager {
  searchIn?: string | Array<string>;
  search?: string;
  order?: 'DESC' | 'ASC';
  match?: Match;
}

export default function useQuery(props: IProps) {
  const { app, me, container } = useApp();
  const done = useRef(false);
  const [loading, setLoading] = useState(false);
  const [query, onQuery] = useState(props);
  const [data, setData] = useState<Array<any>>([]);
  const refetch = (callback?: (err?: string) => void) => {
    setLoading(true);
    const { start = 1, limit = 10, ...reset } = query;
    app
      .list(reset, { start, limit })
      .then((results: Array<any> = []) => {
        if (!Array.isArray(results)) {
          return;
        }
        if (results.length <= 0 || results.length < query.limit) {
          done.current = true;
        }
        if (query.start <= 1) {
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
      .set(value, key, 'node')
      .then((id: string) => {
        app.get(id, 'node').then((val: any) => {
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
