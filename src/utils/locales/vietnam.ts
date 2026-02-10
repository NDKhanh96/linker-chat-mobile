import en from '~/utils/locales/english';

const vi: typeof en = {
    global: {
        submit: 'Gửi yêu cầu',
        submitting: 'Đang gửi yêu cầu...',
    },
    auth: {
        login: 'Đăng nhập',
        forgot_password: 'Quên mật khẩu',
        or_login_with: 'Hoặc đăng nhập bằng',
        do_not_have_an_account: 'Bạn chưa có tài khoản?',
        register_now: 'Đăng ký ngay',
        logging_in: 'Đang đăng nhập...',
        email_invalid: 'Email không hợp lệ',
        password_required: 'Mật khẩu là bắt buộc',
        password_min_length: 'Mật khẩu phải có ít nhất {length} ký tự',
        passwords_do_not_match: 'Mật khẩu không khớp',
        forgot_password_description_1: 'Nhập email của bạn để lấy lại mật khẩu',
        forgot_password_description_2: 'Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu đến email của bạn.',
        return_to_login: 'Quay lại đăng nhập',
        register: 'Đăng ký',
        registering: 'Đang đăng ký...',
        register_description_1: 'Nhập thông tin của bạn để tạo tài khoản',
        agreeTerms: 'Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật',
        email: 'Email',
        password: 'Mật khẩu',
        confirm_password: 'Xác nhận mật khẩu',
        first_name: 'Họ',
        last_name: 'Tên',
        add_avatar: 'Thêm ảnh đại diện',
        privacy_and_security: 'Quyền riêng tư & Bảo mật',
        change_password: 'Đổi mật khẩu',
        change_password_title: 'Đổi mật khẩu của bạn',
        current_password: 'Mật khẩu hiện tại',
        change_password_description_1: 'Nhập mật khẩu hiện tại và mật khẩu mới của bạn',
    },
    forgot_password: {
        success_response: 'Chúng tôi đã gửi mã xác minh đến email của bạn',
        token_required: 'Mã xác minh là bắt buộc',
    },
    reset_password: {
        reset_password_screen_title: 'Đặt lại mật khẩu',
        reset_password_description_1: 'Nhập mã xác minh và mật khẩu mới của bạn',
        verification_code: 'Mã xác minh',
        new_password: 'Mật khẩu mới',
        confirm_new_password: 'Xác nhận mật khẩu mới',
    },
    place_holders: {
        search: 'Tìm kiếm...',
    },
    profile: {
        edit_profile: 'Chỉnh sửa hồ sơ',
        edit_profile_description_1: 'Cập nhật thông tin hồ sơ của bạn',
    },
    menu: {
        use_western_name_order: 'Sử dụng thứ tự tên phương Tây',
    },
    date: {
        yesterday: 'Hôm qua',
    },
    message: {
        no_messages_yet: 'Chưa có tin nhắn',
    },
};

export default vi;
