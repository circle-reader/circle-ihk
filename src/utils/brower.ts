const agent = window.navigator.userAgent.toLowerCase();

export default {
  edge: agent.indexOf('edg') > -1,
  // @ts-ignore
  opera: agent.indexOf('opr') > -1 && !!window.opr,
  firefox: agent.indexOf('firefox') > -1,
  qihu: agent.indexOf('qihu') > -1,
  // @ts-ignore
  chrome: agent.indexOf('chrome') > -1 && !!window.chrome,
};
