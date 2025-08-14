# Toast Redux System

Hệ thống quản lý toast message thông qua Redux state, được xây dựng dựa trên gluestack-ui.

## Các thành phần

### 1. Toast Slice (`redux/slices/toast.slice.ts`)
- Quản lý state của toast messages
- Actions: `showToast`, `hideToast`, `clearAllToasts`, `updateToast`

### 2. useToastRedux Hook (`hooks/use-toast-redux.ts`)
- Hook để tương tác với toast state
- Cung cấp các phương thức tiện lợi: `success`, `error`, `warning`, `info`, `toast`, `hide`, `clear`, `update`

### 3. ToastProvider Component (`components/toast/toast-provider.tsx`)
- Component provider để hiển thị toast từ Redux state
- Tự động render và quản lý lifecycle của toast

### 4. ToastDemo Component (`components/toast/toast-demo.tsx`)
- Component demo để test chức năng toast

## Cách sử dụng

### 1. Setup
Đảm bảo `ToastProvider` được wrap ở root của app:

```tsx
import { ToastProvider } from '~/components/toast';

function App() {
  return (
    <ToastProvider>
      {/* App content */}
    </ToastProvider>
  );
}
```

### 2. Sử dụng trong component

```tsx
import { useToastRedux } from '~/hooks';

function MyComponent() {
  const { success, error, warning, info, clear } = useToastRedux();

  const handleSuccess = () => {
    success('Thành công!', 'Đã lưu dữ liệu thành công');
  };

  const handleError = () => {
    error('Lỗi!', 'Có lỗi xảy ra khi lưu dữ liệu');
  };

  const handleWarning = () => {
    warning('Cảnh báo!', 'Vui lòng kiểm tra lại thông tin');
  };

  const handleInfo = () => {
    info('Thông tin', 'Đây là thông tin quan trọng');
  };

  const handleCustom = () => {
    toast({
      title: 'Custom Toast',
      description: 'Custom message',
      type: 'muted',
      duration: 5000,
      placement: 'top'
    });
  };

  return (
    <View>
      <Button onPress={handleSuccess}>Success</Button>
      <Button onPress={handleError}>Error</Button>
      <Button onPress={handleWarning}>Warning</Button>
      <Button onPress={handleInfo}>Info</Button>
      <Button onPress={handleCustom}>Custom</Button>
      <Button onPress={clear}>Clear All</Button>
    </View>
  );
}
```

### 3. Sử dụng với Redux Action

```tsx
import { useAppDispatch } from '~/redux/store';
import { showToast } from '~/redux/slices/toast.slice';

function MyComponent() {
  const dispatch = useAppDispatch();

  const handleShowToast = () => {
    dispatch(showToast({
      title: 'Direct Redux',
      description: 'Toast from direct Redux action',
      type: 'success'
    }));
  };

  return <Button onPress={handleShowToast}>Show Toast</Button>;
}
```

## API Reference

### ToastMessage Interface
```typescript
interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'muted';
  duration?: number;
  placement?: 'top' | 'bottom' | 'top left' | 'top right' | 'bottom left' | 'bottom right';
}
```

### useToastRedux Hook Methods
- `toast(options)` - Hiển thị toast với options tùy chỉnh
- `success(title, description?, options?)` - Toast success
- `error(title, description?, options?)` - Toast error
- `warning(title, description?, options?)` - Toast warning
- `info(title, description?, options?)` - Toast info
- `hide(id)` - Ẩn toast theo ID
- `clear()` - Xóa tất cả toast
- `update(id, updates)` - Cập nhật toast theo ID

### Redux Actions
- `showToast(payload)` - Thêm toast mới
- `hideToast(id)` - Ẩn toast theo ID
- `clearAllToasts()` - Xóa tất cả toast
- `updateToast({ id, updates })` - Cập nhật toast

## Ưu điểm

1. **Quản lý tập trung**: Tất cả toast được quản lý trong Redux store
2. **Persistent state**: Toast state có thể persist và sync giữa các component
3. **Flexible**: Có thể customize dễ dàng về style, duration, placement
4. **Type-safe**: Full TypeScript support
5. **Easy to use**: API đơn giản và trực quan
6. **Auto cleanup**: Tự động dọn dẹp toast khi unmount

## Lưu ý

- Toast Provider phải được wrap ở level cao của app
- Mỗi toast có ID unique để tránh duplicate
- Toast sẽ tự động ẩn sau `duration` (mặc định 3000ms)
- Có thể hiển thị multiple toast cùng lúc
