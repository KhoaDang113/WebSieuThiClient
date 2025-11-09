/**
 * API Services Export
 *
 * Tập trung export tất cả các services và types
 */

// Export axios instance
export { default as api } from "./axiosConfig";

// Export services
export { default as authService } from "./services/authService";
export { default as userService } from "./services/userService";
export { default as categoryService } from "./services/catalogService";
export { default as productService } from "./services/productService";
export { default as cartService } from "./services/cartService";
export { default as commentService } from "./services/commentService";
export { default as addressService } from "./services/addressService";

// Export types
export type * from "./types";
