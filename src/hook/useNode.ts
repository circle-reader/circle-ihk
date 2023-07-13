import useApp from './useApp';
// import { isUndefined } from '@/utils/is';
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
  const onChange = () => {
    // value: any, key: string
    // if (isUndefined(value)) {
    //   return;
    // }
    // const nVal = {
    //   ...(isObject(val) ? val : { value: val }),
    //   type: id,
    // };
    // // 未设置值并且是关闭状态删除存储值
    // if (
    //   (isBoolean(nVal.checked) && !nVal.checked && isUndefined(nVal.value)) ||
    //   (isUndefined(nVal.checked) && isBoolean(nVal.value) && !nVal.value)
    // ) {
    //   app
    //     .remove(nid, table)
    //     .then(() => {
    //       setValue(value.filter((item: any) => item.id !== nid));
    //     })
    //     .catch((error: Error) => {
    //       console.error(error);
    //     });
    //   return;
    // }
    // app
    //   .set(nid, nVal, table)
    //   .then(() => {
    //     setValue(
    //       value.map((item: any) => {
    //         if (item.id === nid) {
    //           return {
    //             ...item,
    //             ...nVal,
    //           };
    //         }
    //         return item;
    //       })
    //     );
    // })
    // .catch((error: Error) => {
    //   console.error(error);
    // });
  };

  useEffect(refetch, [query, pager]);

  return {
    app,
    data,
    loading,
    refetch,
    onChange,
    pager: setPager,
    query: setQuery,
  };
}
