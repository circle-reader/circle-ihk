import { App } from '../interface';
import templateContext from './template-context';
import { isObject, isUndefined, isString, isNumber } from './is';

export default function dataFromTemplate(
  app: App,
  templateId: string = 'template',
  part?: string
) {
  return app.option('option').then((option) => {
    const templateValue =
      option && option[templateId] ? option[templateId] : '';
    if (!isString(templateValue) || templateValue.length <= 0) {
      return Promise.resolve('Export template not found');
    }
    const context = templateContext(app, part);
    return Promise.resolve(
      templateValue.replace(/\[(.*?)\]/g, (match: string, key: string) => {
        const [scope, attr, start, end] = key.trim().split(':');
        if (scope && attr) {
          const scopeValue = context[scope];
          if (isObject(scopeValue) && !isUndefined(scopeValue[attr])) {
            const valueToReturn = `${scopeValue[attr]}`;
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
      })
    );
  });
}
