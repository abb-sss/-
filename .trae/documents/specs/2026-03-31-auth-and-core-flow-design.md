# 用户认证与核心数据流设计 (Auth & Core Data Flow Design)

## 1. 概述
当前网站的前后端基础骨架已搭建，但核心的用户注册、登录及鉴权流程缺失。本设计文档描述了如何实现完整的 JWT 认证系统，并打通前后端的用户状态管理，以便后续实现资源发布、点赞等需用户权限的功能。

## 2. 架构与技术栈
- **后端框架**: Express + TypeScript
- **数据库 ORM**: Prisma (SQLite)
- **鉴权机制**: JWT (JSON Web Token)
- **密码加密**: bcryptjs
- **前端状态管理**: Zustand
- **前端 HTTP 客户端**: Axios
- **前端路由守卫**: React Router DOM (高阶组件拦截)

## 3. 后端 API 接口设计
- `POST /api/auth/register`
  - 请求: `{ email, password, name }`
  - 处理: 校验邮箱格式，检查是否已存在，密码使用 `bcryptjs` 加密存储，返回新创建的用户和 Token。
- `POST /api/auth/login`
  - 请求: `{ email, password }`
  - 处理: 校验密码，生成带有效期的 JWT Token 并返回给客户端。
- `GET /api/auth/me`
  - 处理: 通过 `authMiddleware` 解析请求头中的 Bearer Token，返回当前用户的基本信息。

## 4. 后端中间件 (Middleware)
- `authMiddleware`: 解析 `Authorization: Bearer <token>`。若 Token 有效，则将 `userId` 注入 `req.user`；若无效或缺失，返回 401 Unauthorized。

## 5. 前端架构与状态设计
- **状态存储 (Zustand Store)**
  - `user`: 存储当前登录用户的基本信息 (id, name, email, avatar 等)。
  - `token`: 存储 JWT 字符串（同时持久化到 localStorage）。
  - `login()`, `logout()`, `register()`, `fetchProfile()`: 核心操作方法。
- **Axios 拦截器**
  - 请求拦截器: 自动在每个请求头中携带 `Authorization: Bearer <token>`。
  - 响应拦截器: 监听 401 状态码，若 Token 过期或无效，自动清除本地状态并重定向到登录页。
- **受保护路由 (ProtectedRoute)**
  - 封装 `<ProtectedRoute>` 组件，对 `/publish`, `/profile` 等需要登录的路由进行拦截。若未登录则重定向至 `/login`。
- **UI 交互更新**
  - **导航栏 (Navbar)**: 根据 `user` 状态，动态显示 "登录/注册" 按钮 或 "用户头像/退出" 下拉菜单。
  - **登录页 (Login.tsx)**: 实现带有表单校验的注册与登录切换面板。

## 6. 核心数据流转图
1. 用户在前端 `Login.tsx` 提交账号密码。
2. Axios 发送请求到 `/api/auth/login`。
3. 后端校验通过，返回 JWT Token。
4. 前端 Axios 拦截器/业务逻辑获取到 Token，存入 Zustand 和 LocalStorage。
5. Zustand 更新 `user` 状态，触发 React 重新渲染 Navbar，显示用户已登录。
6. 用户访问受保护页面（如 `/publish`），前端 `<ProtectedRoute>` 放行。
7. 页面内发起资源发布请求，Axios 请求拦截器自动附带 Token，后端 `authMiddleware` 校验并允许操作。
