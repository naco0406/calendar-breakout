import { useIntl as useReactIntl } from 'react-intl';

export const useIntl = () => {
  const intl = useReactIntl();
  
  return {
    ...intl,
    t: (id: string, values?: Record<string, any>) => 
      intl.formatMessage({ id }, values),
  };
};

export default useIntl;