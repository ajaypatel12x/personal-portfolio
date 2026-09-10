import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 1150
const CONNECTION_DISTANCE = 0.16

function DigitalCore() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current

    if (!canvas || !container) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrame
    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    let rotationY = 0
    let rotationX = -0.08

    const mouse = {
      x: 0,
      y: 0,
      active: false,
    }

    /*
     * ---------------------------------------------------------
     * DETERMINISTIC RANDOM
     * ---------------------------------------------------------
     * Keeps the globe stable instead of generating a new
     * particle arrangement every render.
     * ---------------------------------------------------------
     */
    let seed = 918273

    const random = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    /*
     * ---------------------------------------------------------
     * PARTICLES
     * ---------------------------------------------------------
     */
    const particles = []

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      /*
       * Fibonacci sphere distribution.
       * This gives us an even spherical particle surface.
       */
      const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2
      const radius = Math.sqrt(Math.max(0, 1 - y * y))

      const theta =
        Math.PI *
        (3 - Math.sqrt(5)) *
        i

      const jitter = (random() - 0.5) * 0.018

      particles.push({
        x: radius * Math.cos(theta) + jitter,
        y,
        z: radius * Math.sin(theta) + jitter,

        size:
          random() < 0.08
            ? 1.7 + random() * 1.8
            : 0.45 + random() * 1.15,

        brightness: 0.35 + random() * 0.65,

        colorType: random(),
      })
    }

    /*
     * Extra free-floating particles around the globe.
     */
    const atmosphereParticles = []

    for (let i = 0; i < 180; i += 1) {
      const angle = random() * Math.PI * 2
      const radius = 1.02 + random() * 0.20

      atmosphereParticles.push({
        angle,
        radius,
        y: (random() - 0.5) * 1.65,
        speed: 0.00025 + random() * 0.0007,
        size: 0.35 + random() * 1.15,
        offset: random() * Math.PI * 2,
      })
    }

    /*
     * ---------------------------------------------------------
     * RESIZE
     * ---------------------------------------------------------
     */
    const resize = () => {
      const rect = container.getBoundingClientRect()

      width = rect.width
      height = rect.height

      dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)

      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

    /*
     * ---------------------------------------------------------
     * MOUSE / POINTER
     * ---------------------------------------------------------
     */
    const handlePointerMove = (event) => {
      const rect = container.getBoundingClientRect()

      mouse.x =
        (event.clientX - rect.left) / rect.width - 0.5

      mouse.y =
        (event.clientY - rect.top) / rect.height - 0.5

      mouse.active = true
    }

    const handlePointerLeave = () => {
      mouse.active = false
    }

    container.addEventListener(
      'pointermove',
      handlePointerMove
    )

    container.addEventListener(
      'pointerleave',
      handlePointerLeave
    )

    /*
     * ---------------------------------------------------------
     * ROTATION
     * ---------------------------------------------------------
     */
    const rotatePoint = (point, rotY, rotX) => {
      /*
       * Y rotation
       */
      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)

      const x1 =
        point.x * cosY -
        point.z * sinY

      const z1 =
        point.x * sinY +
        point.z * cosY

      /*
       * X rotation
       */
      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)

      const y2 =
        point.y * cosX -
        z1 * sinX

      const z2 =
        point.y * sinX +
        z1 * cosX

      return {
        x: x1,
        y: y2,
        z: z2,
      }
    }

    /*
     * ---------------------------------------------------------
     * COLOR
     * ---------------------------------------------------------
     */
    const getParticleColor = (
      colorType,
      alpha
    ) => {
      if (colorType < 0.12) {
        return `rgba(255, 137, 91, ${alpha})`
      }

      if (colorType < 0.28) {
        return `rgba(174, 106, 255, ${alpha})`
      }

      return `rgba(54, 190, 255, ${alpha})`
    }

    /*
     * ---------------------------------------------------------
     * DRAW
     * ---------------------------------------------------------
     */
    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      const centerX = width * 0.52
      const centerY = height * 0.51

      /*
       * Make the globe responsive.
       */
      const globeRadius =
        Math.min(width, height) *
        (width < 700 ? 0.39 : 0.43)

      /*
       * Interactive rotation influence.
       */
      const targetX = mouse.active
        ? -mouse.y * 0.22
        : -0.08

      rotationX +=
        (targetX - rotationX) * 0.025

      rotationY += 0.0027

      /*
       * -------------------------------------------------------
       * GLOW
       * -------------------------------------------------------
       */
      const glow = ctx.createRadialGradient(
        centerX,
        centerY,
        globeRadius * 0.05,
        centerX,
        centerY,
        globeRadius * 1.28
      )

      glow.addColorStop(
        0,
        'rgba(0, 170, 255, 0.12)'
      )

      glow.addColorStop(
        0.42,
        'rgba(30, 110, 255, 0.045)'
      )

      glow.addColorStop(
        0.72,
        'rgba(130, 70, 255, 0.025)'
      )

      glow.addColorStop(
        1,
        'rgba(0, 0, 0, 0)'
      )

      ctx.fillStyle = glow

      ctx.beginPath()
      ctx.arc(
        centerX,
        centerY,
        globeRadius * 1.28,
        0,
        Math.PI * 2
      )
      ctx.fill()

      /*
       * -------------------------------------------------------
       * PROJECT SPHERE PARTICLES
       * -------------------------------------------------------
       */
      const projected = []

      for (const particle of particles) {
        const rotated = rotatePoint(
          particle,
          rotationY,
          rotationX
        )

        /*
         * Perspective.
         */
        const perspective =
          1 /
          (1 -
            rotated.z *
              0.34)

        const x =
          centerX +
          rotated.x *
            globeRadius *
            perspective

        const y =
          centerY +
          rotated.y *
            globeRadius *
            perspective

        const depth =
          (rotated.z + 1) / 2

        const alpha =
          0.12 +
          depth *
            0.88

        projected.push({
          x,
          y,
          z: rotated.z,
          depth,
          particle,
          radius:
            particle.size *
            (0.72 + depth * 0.9),
          alpha,
        })
      }

      /*
       * Back particles first.
       */
      projected.sort(
        (a, b) =>
          a.z - b.z
      )

      /*
       * -------------------------------------------------------
       * NETWORK CONNECTIONS
       * -------------------------------------------------------
       *
       * Only connect front/middle particles.
       * This creates the digital-earth network look.
       */
      ctx.lineWidth = 0.45

      for (
        let i = 0;
        i < projected.length;
        i += 5
      ) {
        const a = projected[i]

        if (a.depth < 0.48) continue

        /*
         * Check only nearby indexed particles.
         * This keeps the animation performant.
         */
        for (
          let j = i + 7;
          j < Math.min(
            i + 38,
            projected.length
          );
          j += 7
        ) {
          const b = projected[j]

          if (b.depth < 0.48) continue

          const dx =
            a.x - b.x

          const dy =
            a.y - b.y

          const distance =
            Math.sqrt(
              dx * dx +
                dy * dy
            )

          const maxDistance =
            globeRadius *
            CONNECTION_DISTANCE

          if (
            distance <
            maxDistance
          ) {
            const connectionAlpha =
              Math.max(
                0,
                1 -
                  distance /
                    maxDistance
              ) *
              Math.min(
                a.depth,
                b.depth
              ) *
              0.28

            ctx.strokeStyle =
              `rgba(52, 184, 255, ${connectionAlpha})`

            ctx.beginPath()
            ctx.moveTo(
              a.x,
              a.y
            )
            ctx.lineTo(
              b.x,
              b.y
            )
            ctx.stroke()
          }
        }
      }

      /*
       * -------------------------------------------------------
       * PARTICLES
       * -------------------------------------------------------
       */
      for (const item of projected) {
        const {
          x,
          y,
          radius,
          alpha,
          particle,
        } = item

        const finalAlpha =
          alpha *
          particle.brightness

        /*
         * Larger bright nodes.
         */
        if (radius > 1.5) {
          const nodeGlow =
            ctx.createRadialGradient(
              x,
              y,
              0,
              x,
              y,
              radius * 5
            )

          nodeGlow.addColorStop(
            0,
            getParticleColor(
              particle.colorType,
              finalAlpha * 0.9
            )
          )

          nodeGlow.addColorStop(
            0.35,
            getParticleColor(
              particle.colorType,
              finalAlpha * 0.22
            )
          )

          nodeGlow.addColorStop(
            1,
            'rgba(0,0,0,0)'
          )

          ctx.fillStyle =
            nodeGlow

          ctx.beginPath()
          ctx.arc(
            x,
            y,
            radius * 5,
            0,
            Math.PI * 2
          )
          ctx.fill()
        }

        ctx.fillStyle =
          getParticleColor(
            particle.colorType,
            finalAlpha
          )

        ctx.beginPath()
        ctx.arc(
          x,
          y,
          radius,
          0,
          Math.PI * 2
        )
        ctx.fill()
      }

      /*
       * -------------------------------------------------------
       * ATMOSPHERE / ORBITING PARTICLES
       * -------------------------------------------------------
       */
      for (
        const particle of atmosphereParticles
      ) {
        particle.angle +=
          particle.speed

        const x3 =
          Math.cos(
            particle.angle
          ) *
          particle.radius

        const z3 =
          Math.sin(
            particle.angle
          ) *
          particle.radius

        const rotated =
          rotatePoint(
            {
              x: x3,
              y: particle.y,
              z: z3,
            },
            rotationY * 0.72,
            rotationX
          )

        const perspective =
          1 /
          (1 -
            rotated.z *
              0.25)

        const x =
          centerX +
          rotated.x *
            globeRadius *
            perspective

        const y =
          centerY +
          rotated.y *
            globeRadius *
            perspective

        const alpha =
          0.05 +
          ((rotated.z + 1) / 2) *
            0.32

        ctx.fillStyle =
          `rgba(76, 160, 255, ${alpha})`

        ctx.beginPath()

        ctx.arc(
          x,
          y,
          particle.size,
          0,
          Math.PI * 2
        )

        ctx.fill()
      }

      /*
       * -------------------------------------------------------
       * FINE OUTER ATMOSPHERE
       * -------------------------------------------------------
       */
      ctx.strokeStyle =
        'rgba(38, 171, 255, 0.10)'

      ctx.lineWidth = 0.7

      ctx.beginPath()

      ctx.arc(
        centerX,
        centerY,
        globeRadius *
          1.01,
        0,
        Math.PI * 2
      )

      ctx.stroke()

      /*
       * Subtle second atmosphere edge.
       */
      ctx.strokeStyle =
        'rgba(148, 82, 255, 0.06)'

      ctx.beginPath()

      ctx.arc(
        centerX,
        centerY,
        globeRadius *
          1.055,
        0,
        Math.PI * 2
      )

      ctx.stroke()

      /*
       * -------------------------------------------------------
       * CENTRAL CORE
       * -------------------------------------------------------
       */
      const coreRadius =
        globeRadius *
        0.075

      const coreGlow =
        ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          coreRadius * 3
        )

      coreGlow.addColorStop(
        0,
        'rgba(110, 225, 255, 0.95)'
      )

      coreGlow.addColorStop(
        0.25,
        'rgba(35, 180, 255, 0.45)'
      )

      coreGlow.addColorStop(
        1,
        'rgba(0, 0, 0, 0)'
      )

      ctx.fillStyle =
        coreGlow

      ctx.beginPath()

      ctx.arc(
        centerX,
        centerY,
        coreRadius * 3,
        0,
        Math.PI * 2
      )

      ctx.fill()

      ctx.fillStyle =
        'rgba(210, 248, 255, 0.95)'

      ctx.beginPath()

      ctx.arc(
        centerX,
        centerY,
        coreRadius,
        0,
        Math.PI * 2
      )

      ctx.fill()

      /*
       * -------------------------------------------------------
       * ORBITAL LIGHT STREAK
       * -------------------------------------------------------
       */
      const orbitAngle =
        rotationY * 1.8

      const orbitX =
        centerX +
        Math.cos(
          orbitAngle
        ) *
          globeRadius *
          1.06

      const orbitY =
        centerY +
        Math.sin(
          orbitAngle
        ) *
          globeRadius *
          0.32

      const orbitGlow =
        ctx.createRadialGradient(
          orbitX,
          orbitY,
          0,
          orbitX,
          orbitY,
          14
        )

      orbitGlow.addColorStop(
        0,
        'rgba(255,255,255,0.95)'
      )

      orbitGlow.addColorStop(
        0.2,
        'rgba(72,205,255,0.65)'
      )

      orbitGlow.addColorStop(
        1,
        'rgba(0,0,0,0)'
      )

      ctx.fillStyle =
        orbitGlow

      ctx.beginPath()

      ctx.arc(
        orbitX,
        orbitY,
        14,
        0,
        Math.PI * 2
      )

      ctx.fill()

      ctx.fillStyle =
        'rgba(235, 250, 255, 0.95)'

      ctx.beginPath()

      ctx.arc(
        orbitX,
        orbitY,
        2.2,
        0,
        Math.PI * 2
      )

      ctx.fill()

      animationFrame =
        requestAnimationFrame(
          draw
        )
    }

    draw()

    /*
     * ---------------------------------------------------------
     * CLEANUP
     * ---------------------------------------------------------
     */
    return () => {
      cancelAnimationFrame(
        animationFrame
      )

      resizeObserver.disconnect()

      container.removeEventListener(
        'pointermove',
        handlePointerMove
      )

      container.removeEventListener(
        'pointerleave',
        handlePointerLeave
      )
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="digital-core"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="digital-core-canvas"
      />

      <div className="digital-core-label digital-core-label-top">
        <span className="label-line"></span>
        AI / ML
      </div>

      <div className="digital-core-label digital-core-label-right">
        CODE
        <span className="label-line"></span>
      </div>

      <div className="digital-core-label digital-core-label-bottom">
        DATA
        <span className="label-line"></span>
      </div>

      <div className="digital-core-label digital-core-label-left">
        IMPACT
        <span className="label-line"></span>
      </div>

      <div className="digital-core-center-text">
        AJAY
      </div>
    </div>
  )
}

export default DigitalCore