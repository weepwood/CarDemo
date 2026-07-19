# CarDemo AI 贴图提示词方案

本项目首版使用浏览器 Canvas 生成的程序化赛车贴花，确保无需外部资源即可运行。下面的提示词用于后续批量生成可替换的高质量车身贴图。所有车型均为原创设计，请避免加入真实车厂标志、赛事商标、人物肖像或可识别品牌文字。

## 1. 通用生成规范

### 推荐输出

- 尺寸：2048 × 2048，PNG。
- 构图：正交视图，平面化纹理图，不包含透视。
- 用途：车身侧面贴花或 UV 贴图，而不是完整汽车渲染图。
- 背景：透明背景，或纯黑背景方便使用 Screen/Add 混合。
- 内容：无品牌、无文字、无水印、无照片背景。
- 纹理：主体元素远离边缘，保证裁切和重复铺设。

### 通用正向提示词模板

```text
A production-ready automotive livery texture sheet for an original fictional racing vehicle, [STYLE], [MOTIF], [COLOR PALETTE], flat orthographic texture design, isolated graphic elements, transparent background, clean alpha edges, layered racing decals, balanced negative space, readable at high speed, premium motorsport art direction, designed for a 3D vehicle UV map, no perspective, no car body, no environment, no logo, no lettering, no watermark, 2048x2048
```

### 通用负向提示词

```text
real car photo, complete vehicle, perspective view, showroom, road, driver, people, text, letters, numbers, brand logo, sponsor logo, trademark, watermark, signature, blurry edge, JPEG artifacts, dirty alpha, excessive tiny details, asymmetrical crop, low resolution
```

## 2. 三渲二超跑贴花

适用车型：NOVA R9。

```text
A production-ready automotive livery texture sheet for an original fictional futuristic hypercar, premium 3D-to-2D cel-shaded animation style, long white speed ribbons, sharp orange energy strokes, sparse black ink contours, subtle manga halftone gradients, aerodynamic directional flow from front to rear, orange white charcoal palette, flat orthographic texture design, isolated graphic elements, transparent background, clean alpha edges, bold readable shapes, designed for a 3D vehicle UV map, no perspective, no car body, no environment, no logo, no lettering, no watermark, 2048x2048
```

设计重点：使用大块色带形成轮廓，不要生成过多细碎装饰；贴花方向必须统一朝向车辆尾部。

## 3. 卡车赛车贴花

适用车型：BRUTUS X。

```text
A production-ready automotive livery texture sheet for an original fictional circuit racing truck, aggressive truck racing style, oversized diagonal slashes, rugged geometric armor panels, cyan technical line accents, red white dark graphite palette, subtle dust scratches and chipped paint masks, high-impact motorsport composition, flat orthographic texture design, isolated graphic elements, transparent background, strong silhouette, clean alpha edges, designed for a 3D truck UV map, no perspective, no truck body, no environment, no logo, no lettering, no sponsor marks, no watermark, 2048x2048
```

设计重点：力量感来自宽斜线和大块装甲分区，而不是堆积虚构品牌文字。

## 4. 拟真 GT 赛车贴花

适用车型：AERO GT。

```text
A production-ready automotive livery texture sheet for an original fictional grand touring race car, realistic endurance racing art direction, precise dual center stripes, subtle metallic pearl edge highlights, yellow safety accents, deep cobalt blue and warm white palette, restrained premium detailing, clean vector-like masking, flat orthographic texture design, transparent background, physically plausible paint layers, designed for a 3D vehicle UV map, no perspective, no car body, no road, no logo, no lettering, no sponsor marks, no watermark, 2048x2048
```

建议额外生成：

- `albedo`：纯颜色贴花。
- `roughness mask`：白色代表更粗糙，黑色代表更光滑。
- `normal detail`：极轻微的贴纸边缘起伏，不要产生明显凹凸。

## 5. 卡通可爱敞篷车贴花

适用车型：MIZU S。

```text
A production-ready automotive livery texture sheet for an original fictional cute compact roadster, charming toy-like cartoon style, rounded bubbles, soft cloud shapes, tiny stars, playful curved motion trails, pastel pink lemon yellow mint green lavender palette, thick friendly outlines, simple readable forms, flat orthographic texture design, isolated graphic elements, transparent background, clean alpha edges, designed for a 3D vehicle UV map, no perspective, no complete car, no character, no face, no text, no logo, no watermark, 2048x2048
```

设计重点：保留大面积留白，图案边缘圆润，避免幼儿贴纸式信息过载。

## 6. 复古漫画宽体贴花

适用车型：HERITAGE 73。

```text
A production-ready automotive livery texture sheet for an original fictional 1970s-inspired widebody sports car, retro racing manga style, coarse halftone dots, hand-inked speed bursts, warm orange cream forest green palette, vintage screen-print texture, bold asymmetrical panel composition, subtle paper grain limited to decal areas, flat orthographic texture design, transparent background, clean alpha edges, designed for a 3D vehicle UV map, no perspective, no complete car, no vintage brand, no lettering, no racing number, no watermark, 2048x2048
```

## 7. 真实碳纤维材质

适合用作局部材质，而不是整车贴花。

```text
Seamless PBR carbon fiber material texture, premium automotive twill weave, physically accurate 2x2 diagonal pattern, dark graphite fibers, subtle resin reflections, uniform scale, tileable in all directions, neutral lighting, flat texture scan, no perspective, no object, no logo, no text, 2048x2048
```

需分别生成或转换为：Base Color、Normal、Roughness。

## 8. 接入项目

将生图结果保存到：

```text
public/textures/<car-id>/<texture-name>.png
```

建议命名：

```text
nova-r9/toon-decal.png
brutus-x/truck-racing-decal.png
aero-gt/realistic-stripe.png
mizu-s/cute-bubble.png
heritage-73/retro-halftone.png
```

然后在 `src/lib/textures.js` 中增加图片加载分支；加载失败时继续使用当前程序化贴花作为降级方案。

## 9. 质量检查

生成后至少检查：透明边缘、左右翻转后文字问题、贴图接缝、近景锯齿、色彩空间、文件尺寸和移动端显存占用。网页端建议提供 1024 与 2048 两套纹理，并根据设备能力选择。
