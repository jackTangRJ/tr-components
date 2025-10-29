# tr-components
web-components组件封装

## 安装
```bash
pnpm install
```

## 使用
```html
<script type="module" src="src/components/index.ts"></script>
<auto-complete name="username" keyword="name" api="http://localhost:4000/users"></auto-complete>
```

## 运行
```bash
pnpm run dev
npm run api
```

## 打包
```bash
# 打包ESM 适用框架环境
pnpm run build
# 打包umd 适用与浏览器环境
pnpm run build:umd
```

 