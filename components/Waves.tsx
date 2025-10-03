// components/Waves.tsx
'use client';

import React, { useRef, useEffect, forwardRef } from "react";
import { cn } from '@/lib/utils';

class Grad {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    dot2(x: number, y: number): number {
        return this.x * x + this.y * y;
    }
}

class Noise {
    grad3: Grad[] = [
        new Grad(1, 1, 0),
        new Grad(-1, 1, 0),
        new Grad(1, -1, 0),
        new Grad(-1, -1, 0),
        new Grad(1, 0, 1),
        new Grad(-1, 0, 1),
        new Grad(1, 0, -1),
        new Grad(-1, 0, -1),
        new Grad(0, 1, 1),
        new Grad(0, -1, 1),
        new Grad(0, 1, -1),
        new Grad(0, -1, -1),
    ];
    p: number[] = [
        151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
        140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247,
        120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177,
        33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165,
        71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211,
        133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25,
        63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
        135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217,
        226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206,
        59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248,
        152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22,
        39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218,
        246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
        81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
        184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93,
        222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
    ];
    perm: number[] = new Array(512);
    gradP: Grad[] = new Array(512);

    constructor(seed = 0) {
        this.seed(seed);
    }
    seed(seed: number) {
        if (seed > 0 && seed < 1) seed *= 65536;
        seed = Math.floor(seed);
        if (seed < 256) seed |= seed << 8;
        for (let i = 0; i < 256; i++) {
            const v =
                i & 1 ? this.p[i] ^ (seed & 255) : this.p[i] ^ ((seed >> 8) & 255);
            this.perm[i] = this.perm[i + 256] = v;
            this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
        }
    }
    fade(t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    lerp(a: number, b: number, t: number): number {
        return (1 - t) * a + t * b;
    }
    perlin2(x: number, y: number): number {
        let X = Math.floor(x),
            Y = Math.floor(y);
        x -= X;
        y -= Y;
        X &= 255;
        Y &= 255;
        const n00 = this.gradP[X + this.perm[Y]].dot2(x, y);
        const n01 = this.gradP[X + this.perm[Y + 1]].dot2(x, y - 1);
        const n10 = this.gradP[X + 1 + this.perm[Y]].dot2(x - 1, y);
        const n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(x - 1, y - 1);
        const u = this.fade(x);
        return this.lerp(
            this.lerp(n00, n10, u),
            this.lerp(n01, n11, u),
            this.fade(y)
        );
    }
}

interface Point {
    x: number;
    y: number;
    wave: { x: number; y: number };
}

interface Config {
    lineColor?: string;
    waveSpeedX: number;
    waveSpeedY: number;
    waveAmpX: number;
    waveAmpY: number;
    xGap: number;
    yGap: number;
}

export interface WavesProps extends React.HTMLAttributes<HTMLDivElement> {
    lineColor?: string;
    backgroundColor?: string;
    waveSpeedX?: number;
    waveSpeedY?: number;
    waveAmpX?: number;
    waveAmpY?: number;
    xGap?: number;
    yGap?: number;
}

export const Waves = forwardRef<HTMLDivElement, WavesProps>(({
                                                                 lineColor,
                                                                 backgroundColor,
                                                                 waveSpeedX = 0.04,
                                                                 waveSpeedY = 0.03,
                                                                 waveAmpX = 20,
                                                                 waveAmpY = 25,
                                                                 xGap = 20,
                                                                 yGap = 20,
                                                                 className,
                                                                 style,
                                                                 ...props
                                                             }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const boundingRef = useRef<{
        width: number;
        height: number;
        left: number;
        top: number;
    }>({ width: 0, height: 0, left: 0, top: 0 });
    const linesRef = useRef<Point[][]>([]);
    const configRef = useRef<Config>({
        lineColor,
        waveSpeedX,
        waveSpeedY,
        waveAmpX,
        waveAmpY,
        xGap,
        yGap,
    });
    const noiseRef = useRef<Noise>(new Noise());
    const frameIdRef = useRef<number | null>(null);
    const lastFrameTimeRef = useRef<number>(0);

    // Определение типа устройства
    const isMobile = () => window.innerWidth < 768;
    const isTablet = () => window.innerWidth >= 768 && window.innerWidth < 1024;

    useEffect(() => {
        configRef.current = {
            lineColor,
            waveSpeedX,
            waveSpeedY,
            waveAmpX,
            waveAmpY,
            xGap,
            yGap,
        };
    }, [lineColor, waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, xGap, yGap]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctxRef.current = ctx;

        function setSize() {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            boundingRef.current = {
                width: rect.width,
                height: rect.height,
                left: rect.left,
                top: rect.top,
            };
            
            // Adaptive resolution for mobile devices
            const pixelRatio = isMobile() ? 1 : window.devicePixelRatio || 1;
            canvas!.width = rect.width * pixelRatio;
            canvas!.height = rect.height * pixelRatio;
            canvas!.style.width = rect.width + 'px';
            canvas!.style.height = rect.height + 'px';
            ctx!.scale(pixelRatio, pixelRatio);
        }

        function setLines() {
            const { width, height } = boundingRef.current;
            linesRef.current = [];
            const oWidth = width + 200,
                oHeight = height + 30;
            
            //Adaptive parameters for different devices
            let adaptiveXGap = configRef.current.xGap;
            let adaptiveYGap = configRef.current.yGap;
            
            if (isMobile()) {
                // Для мобильных - увеличиваем расстояние между точками
                adaptiveXGap = Math.max(configRef.current.xGap * 1.8, 25);
                adaptiveYGap = Math.max(configRef.current.yGap * 1.8, 25);
            } else if (isTablet()) {
                // Для планшетов - умеренное увеличение
                adaptiveXGap = Math.max(configRef.current.xGap * 1.3, 20);
                adaptiveYGap = Math.max(configRef.current.yGap * 1.3, 20);
            }
            
            const totalLines = Math.ceil(oWidth / adaptiveXGap);
            const totalPoints = Math.ceil(oHeight / adaptiveYGap);
            const xStart = (width - adaptiveXGap * totalLines) / 2;
            const yStart = (height - adaptiveYGap * totalPoints) / 2;
            
            for (let i = 0; i <= totalLines; i++) {
                const pts: Point[] = [];
                for (let j = 0; j <= totalPoints; j++) {
                    pts.push({
                        x: xStart + adaptiveXGap * i,
                        y: yStart + adaptiveYGap * j,
                        wave: { x: 0, y: 0 },
                    });
                }
                linesRef.current.push(pts);
            }
        }

        function movePoints(time: number) {
            const lines = linesRef.current;
            const noise = noiseRef.current;
            let {
                waveSpeedX,
                waveSpeedY,
                waveAmpX,
                waveAmpY,
            } = configRef.current;

            if (isMobile()) {
                waveSpeedX *= 0.7;
                waveSpeedY *= 0.7;
                waveAmpX *= 0.6;
                waveAmpY *= 0.6;
            } else if (isTablet()) {
                waveSpeedX *= 0.85;
                waveSpeedY *= 0.85;
                waveAmpX *= 0.8;
                waveAmpY *= 0.8;
            }

            lines.forEach((pts) => {
                pts.forEach((p) => {
                    const move =
                        noise.perlin2(
                            (p.x + time * waveSpeedX) * 0.002,
                            (p.y + time * waveSpeedY) * 0.0015
                        ) * 12;
                    p.wave.x = Math.cos(move) * waveAmpX;
                    p.wave.y = Math.sin(move) * waveAmpY;
                });
            });
        }

        function moved(point: Point): { x: number; y: number } {
            const x = point.x + point.wave.x;
            const y = point.y + point.wave.y;
            return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
        }

        function drawLines() {
            const { width, height } = boundingRef.current;
            const ctx = ctxRef.current;
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);
            ctx.beginPath();
            
            // Adaptive lines thickness
            ctx.lineWidth = isMobile() ? 0.3 : 0.5;

            // Получаем цвет динамически каждый раз
            let strokeColor = configRef.current.lineColor;
            if (!strokeColor) {
                const style = getComputedStyle(document.documentElement);
                strokeColor = style.getPropertyValue('--primary').trim();
            }
            ctx.strokeStyle = strokeColor;
            
            // Adaptive transparency
            const isDark = document.documentElement.classList.contains("dark");
            if (isMobile()) {
                ctx.globalAlpha = isDark ? 0.15 : 0.25; // Более прозрачные линии на мобильных
            } else {
                ctx.globalAlpha = isDark ? 0.2 : 0.4;
            }
            
            ctx.shadowColor = strokeColor;
            
            linesRef.current.forEach((points) => {
                let p1 = moved(points[0]);
                ctx.moveTo(p1.x, p1.y);
                points.forEach((p, idx) => {
                    const isLast = idx === points.length - 1;
                    p1 = moved(p);
                    const p2 = moved(
                        points[idx + 1] || points[points.length - 1]
                    );
                    ctx.lineTo(p1.x, p1.y);
                    if (isLast) ctx.moveTo(p2.x, p2.y);
                });
            });
            ctx.stroke();
            ctx.globalAlpha = 1.0;
            ctx.shadowBlur = 0;
        }

        function tick(t: number) {
            const targetFPS = isMobile() ? 30 : 60;
            const frameInterval = 1000 / targetFPS;
            
            if (t - lastFrameTimeRef.current >= frameInterval) {
                movePoints(t);
                drawLines();
                lastFrameTimeRef.current = t;
            }
            
            frameIdRef.current = requestAnimationFrame(tick);
        }

        function onResize() {
            setSize();
            setLines();
        }

        setSize();
        setLines();
        frameIdRef.current = requestAnimationFrame(tick);
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
            if (frameIdRef.current !== null) {
                cancelAnimationFrame(frameIdRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={ref}
            className={cn("w-full h-full", className)}
            style={style}
            {...props}
        >
            <div
                ref={containerRef}
                style={{
                    backgroundColor,
                }}
                className="absolute top-0 left-0 w-full h-full overflow-hidden"
            >
                <canvas ref={canvasRef} className="block w-full h-full" />
            </div>
        </div>
    );
});

Waves.displayName = 'Waves';

export default Waves;