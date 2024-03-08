import { useState, useEffect } from 'react';
import useApp from './useApp';
import { Match } from '../interface';
import { isUndefined, isFunction } from '../utils/is';

interface IData {
  start: number;
  limit: number;
  data: Array<any>;
}

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
  const [done, onDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, onQuery] = useState(prop);
  const [data, setData] = useState<IData>({
    data: [],
    start: query.start || 1,
    limit: query.limit || 10,
  });
  const refetch = (callback?: (err?: string) => void) => {
    setLoading(true);
    const { start = 1, limit = 10, ...reset } = query;
    app
      .list(reset, { start, limit }, table)
      .then((res: IData) => {
        if (res.data.length <= 0 || res.data.length < limit) {
          onDone(true);
        }
        if (start <= 1) {
          setData(res);
        } else {
          setData((lastData) => ({
            start: res.start,
            limit: res.limit,
            data: [...lastData.data, ...res.data],
          }));
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
      .then(() => {
        const index = data.data.findIndex((prop: any) => prop.id === key);
        if (index >= 0) {
          data.data[index] = value;
        } else {
          data.data.push(value);
        }
        setData({
          ...data,
          data: [...data.data],
        });
        // @ts-ignore
        isFunction(callback) && callback();
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
    done,
    query,
    onDone,
    onQuery,
    onChange,
    loading,
    refetch,
    container,
    loadMore: done
      ? null
      : () => {
          if (loading) {
            return;
          }
          onQuery({
            ...query,
            start: data.start,
          });
        },
  };
}
