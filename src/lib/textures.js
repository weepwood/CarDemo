import * as THREE from 'three'

const size = 1024

function drawVelocity(ctx, accent) {
  ctx.lineCap = 'round'
  for (let i = 0; i < 7; i += 1) {
    const y = 250 + i * 68
    ctx.strokeStyle = i % 2 === 0 ? accent : '#ffffff'
    ctx.lineWidth = 28 - i * 2
    ctx.beginPath()
    ctx.moveTo(-40 + i * 45, y)
    ctx.bezierCurveTo(270, y - 90, 560, y + 70, 1080, y - 55)
    ctx.stroke()
  }
}

function drawStripe(ctx, accent) {
  ctx.fillStyle = accent
  ctx.transform(1, 0, -0.28, 1, 180, 0)
  ctx.fillRect(120, 0, 180, size)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(330, 0, 54, size)
  ctx.fillStyle = 'rgba(10, 12, 18, .75)'
  ctx.fillRect(420, 0, 22, size)
}

function drawBubble(ctx, accent) {
  const circles = [
    [190, 390, 140],
    [420, 530, 92],
    [690, 350, 170],
    [830, 650, 98],
  ]
  circles.forEach(([x, y, radius], index) => {
    ctx.fillStyle = index % 2 ? '#ffffff' : accent
    ctx.globalAlpha = 0.82
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.globalAlpha = 1
}

function drawHalftone(ctx, accent) {
  for (let y = 120; y < size; y += 46) {
    for (let x = 80; x < size; x += 46) {
      const distance = Math.hypot(x - 520, y - 470)
      const radius = Math.max(3, 18 - distance / 46)
      ctx.fillStyle = distance < 360 ? accent : '#ffffff'
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function drawSlash(ctx, accent) {
  ctx.save()
  ctx.rotate(-0.33)
  ;[0, 1, 2, 3].forEach((index) => {
    ctx.fillStyle = index % 2 ? '#ffffff' : accent
    ctx.fillRect(-180 + index * 220, 260, 140, 900)
  })
  ctx.restore()
  ctx.strokeStyle = '#11141a'
  ctx.lineWidth = 30
  ctx.strokeRect(70, 70, size - 140, size - 140)
}

const painters = {
  velocity: drawVelocity,
  stripe: drawStripe,
  bubble: drawBubble,
  halftone: drawHalftone,
  slash: drawSlash,
}

export function createDecalTexture(theme, accent) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, size, size)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.015)'
  ctx.fillRect(0, 0, size, size)
  painters[theme]?.(ctx, accent)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

export function disposeTexture(texture) {
  texture?.dispose()
}
