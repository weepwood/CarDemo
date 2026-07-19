# CarDemo

一个可直接运行的原创跑车 3D 交互展厅。项目使用 React、Three.js 与 React Three Fiber，在浏览器中实时生成车身、轮胎、玻璃、灯光、尾翼和赛车贴花，不依赖外部汽车模型。

## 已实现

- 5 种原创车型：未来超跑、GT、轻量敞篷、复古宽体、卡车赛车。
- 3 套实时视觉模式：真实质感、3 渲 2、卡通可爱。
- 4 套车漆、车型专属赛车贴花与日夜摄影棚灯光。
- 黑色轮廓、Toon 明暗、金属清漆、玻璃透射和接触阴影。
- 主视角、侧面、车头、俯视镜头。
- 鼠标旋转和缩放、自动旋转、键盘快捷键。
- 桌面端和移动端响应式布局。
- Canvas 程序化贴图降级方案。
- 完整 AI 生图贴图提示词与接入规范。
- GitHub Actions 构建检查和 Netlify 配置。

## 技术栈

- React 19
- Vite 7
- Three.js
- React Three Fiber
- Drei
- Lucide React

## 本地启动

```bash
npm install
npm run dev
```

浏览器打开 Vite 输出的本地地址。

## 构建

```bash
npm run lint
npm run build
npm run preview
```

构建产物位于 `dist`。

## 操作

- 鼠标左键拖拽：旋转镜头。
- 鼠标滚轮：缩放。
- `←` / `→`：切换车型。
- `Space`：暂停或继续自动旋转。
- `N`：切换日间与夜间灯光。

## 车型

| 车型 | 类型 | 视觉侧重 |
| --- | --- | --- |
| NOVA R9 | 未来混动超跑 | 3 渲 2 速度线、低车身、主动尾翼 |
| AERO GT | 前置引擎 GT | 拟真车漆、耐力赛双条纹 |
| MIZU S | 中置轻量敞篷 | 卡通可爱、圆润比例、气泡贴花 |
| HERITAGE 73 | 经典宽体跑车 | 复古漫画网点、机械化尾翼 |
| BRUTUS X | 短轴赛道卡车 | 卡车赛车、巨型斜线和高驾驶舱 |

## 贴图生成方案

当前版本通过 `src/lib/textures.js` 在浏览器中生成贴花，保证仓库克隆后立即可运行。正式美术资产建议通过生图模型批量生成透明 PNG，再替换程序化纹理。

完整优化提示词见：

- [`docs/IMAGE_PROMPTS.md`](docs/IMAGE_PROMPTS.md)

核心提示词结构：

```text
A production-ready automotive livery texture sheet for an original fictional racing vehicle,
[视觉风格], [图案主题], [色彩方案], flat orthographic texture design,
isolated graphic elements, transparent background, clean alpha edges,
designed for a 3D vehicle UV map, no perspective, no car body,
no environment, no logo, no lettering, no watermark, 2048x2048
```

为了降低版权和商标风险，生成时不要使用真实车厂标志、车型名称、赛事标识或赞助商文字。

## 替换为真实 GLB 模型

项目的车型接口集中在 `src/data/cars.js`，场景实现位于 `src/components/CarScene.jsx`。后续可采用以下路径升级：

1. 在 Blender 中制作低模和高模。
2. 使用 UV 展开并导出 GLB。
3. 将模型放入 `public/models`。
4. 使用 Drei 的 `useGLTF` 替换程序化车体。
5. 保留当前材质模式、灯光、镜头和 UI 控制。
6. 使用 Draco 或 Meshopt 压缩，并为移动端提供低模版本。

## Netlify 部署

仓库已包含 `netlify.toml`：

- Build command：`npm run build`
- Publish directory：`dist`
- Node.js：22

在 Netlify 中导入此 GitHub 仓库即可部署。

## 性能策略

- DPR 上限限制为 1.75。
- 无外部 HDR 文件，摄影棚环境由 Lightformer 实时生成。
- 贴花通过 CanvasTexture 生成，并在车型切换时释放。
- 移动端减少控制面板信息密度。
- 后续接入图片时建议同时提供 1024 和 2048 两套纹理。

## 项目结构

```text
CarDemo/
├─ .github/workflows/ci.yml
├─ docs/IMAGE_PROMPTS.md
├─ public/favicon.svg
├─ src/
│  ├─ components/CarScene.jsx
│  ├─ data/cars.js
│  ├─ lib/textures.js
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ styles.css
├─ netlify.toml
├─ package.json
└─ vite.config.js
```

## 版权说明

项目中的车型名称、造型参数和贴花概念均为原创虚构内容，不代表任何真实汽车品牌。代码可按仓库许可证使用；接入第三方模型或生成资产时，请自行确认其授权范围。
