import { renderHook } from '@testing-library/react-hooks';
import { useDebounce } from './use-debounce';

test('should debounce value', () => {
  const { result, waitForNextUpdate } = renderHook(() => useDebounce('test', 1000));
  
  expect(result.current).toBe('test');
  
  waitForNextUpdate();
  
  expect(result.current).toBe('test');
});