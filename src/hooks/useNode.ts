import useApp from './useApp';
import { useState, useEffect } from 'react';
import { Query, Pager } from '../interface';

interface IProps {
  pager?: Pager;
  query?: Query;
}

export default function useNode(props: IProps) {
  const { pager: pagerProps, query: queryProps } = props;
  const { app } = useApp();
  const [data, setData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [pager, setPager] = useState(pagerProps);
  const [query, setQuery] = useState(queryProps);
  const refetch = () => {
    setLoading(true);
    app
      .list(query, pager)
      .then((data: any) => {
        setLoading(false);
        Array.isArray(data) && data.length > 0 && setData(data);
      })
      .catch((error: Error) => {
        setLoading(false);
        console.error(error);
      });
  };

  useEffect(refetch, [query, pager]);

  return {
    app,
    data,
    refetch,
    loading,
    pager: setPager,
    query: setQuery,
  };
}
