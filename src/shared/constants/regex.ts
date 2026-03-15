/**
 * Regex constants — KHÔNG viết regex inline trong code.
 * Import từ đây để đảm bảo tái sử dụng và nhất quán FE/BE.
 */
export const REGEX = {
  /**
   * Password strength — phải có ít nhất:
   * 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt
   */
  PASSWORD_STRENGTH:
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])/,
} as const;
