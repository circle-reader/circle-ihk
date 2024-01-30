import { App } from '../interface';
import templateContext from './template-context';
import { isObject, isUndefined, isNumber } from './is';

export default function dataFromTemplate<T>(
  app: App,
  templateId: T,
  args: {
    id: string;
    part?: string | HTMLElement;
    option?: {
      [index: string]: string;
    };
  }
): Promise<T> {
  return (
    args.option ? Promise.resolve(args.option) : app.option('option')
  ).then((result) => {
    const returnValue: Array<string> = [];
    const context = templateContext(app, args.part);
    (Array.isArray(templateId) ? templateId : [templateId]).forEach(
      (template) => {
        const templateValue =
          result && result[template]
            ? result[template]
            : 'Export template not found';
        const data = templateValue.replace(
          /\[(.*?)\]/g,
          (match: string, key: string) => {
            const [scope, attr, start, end] = key.trim().split(':');
            if (scope && attr) {
              const scopeValue = context[scope];
              if (isObject(scopeValue)) {
                const value = scopeValue[attr];
                if (isUndefined(value)) {
                  return '';
                }
                const valueToReturn = `${value}`;
                if (start && end) {
                  const startVal = parseFloat(start);
                  const endVal = parseFloat(end);
                  if (
                    isNumber(startVal) &&
                    startVal >= 0 &&
                    isNumber(endVal) &&
                    endVal > 0 &&
                    endVal > startVal
                  ) {
                    const valToReturn = valueToReturn.slice(startVal, endVal);
                    if (endVal < valueToReturn.length) {
                      return `${valToReturn}...`;
                    }
                    return valToReturn;
                  }
                  return valueToReturn;
                }
                return valueToReturn;
              }
              return match;
            }
            return match;
          }
        );
        returnValue.push(app.applyFilter(template, data, args.id));
      }
    );
    return Promise.resolve(
      returnValue.length === 1 ? returnValue[0] : returnValue
    ) as T;
  });
}
