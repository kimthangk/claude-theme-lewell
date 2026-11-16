// The LeWell lockup for the backdrop (16 Nov), as on lewell.app: the app icon
// (the real icon, Lewy's face close-up, converted to pixel strokes because the
// backdrop shows no pictures), and "LeWell" in Fredoka
// SemiBold #27834B (outlines from the app's own font). Small, flat, bottom right.

const WORDMARK = 'M131 983Q95 983 79 972Q63 962 59 944Q55 926 55 907V360Q55 340 58 323Q62 306 78 295Q94 284 131 284Q169 284 184 295Q200 306 204 323Q207 340 207 360V851H481Q498 851 513 854Q528 857 538 871Q547 885 547 917Q547 948 537 962Q527 977 512 980Q498 983 481 983ZM854 992Q784 992 734 969Q683 946 651 908Q619 871 604 825Q588 779 588 733Q588 658 622 600Q656 542 716 508Q776 475 854 475Q912 475 954 494Q997 512 1024 542Q1052 571 1066 605Q1079 639 1079 670Q1079 725 1052 752Q1026 778 985 778H747Q749 804 766 822Q782 840 807 850Q832 860 860 860Q884 860 902 858Q920 855 933 850Q946 846 957 842Q968 837 976 834Q985 831 993 830Q1008 829 1020 838Q1033 848 1043 867Q1050 878 1052 888Q1055 898 1055 908Q1055 932 1030 951Q1006 970 962 981Q917 992 854 992ZM747 696H905Q921 696 928 690Q936 685 936 669Q936 651 925 638Q914 624 896 616Q877 609 853 609Q822 609 798 621Q774 633 760 653Q747 673 747 696ZM1389 981Q1363 981 1348 971Q1333 961 1326 948Q1320 935 1318 930L1130 385Q1117 343 1126 322Q1135 302 1178 288Q1206 279 1224 280Q1241 281 1252 294Q1264 307 1273 335L1398 706L1503 340Q1506 330 1512 317Q1519 304 1534 294Q1549 284 1576 284Q1607 284 1622 295Q1638 306 1644 319Q1650 332 1653 339L1759 708L1883 336Q1892 308 1904 294Q1915 281 1934 279Q1952 277 1980 287Q2010 298 2022 310Q2034 322 2034 340Q2035 357 2027 385L1839 930Q1837 936 1830 948Q1824 961 1810 971Q1795 981 1767 981Q1740 981 1724 969Q1708 957 1702 944Q1695 930 1693 925L1578 552L1463 925Q1462 930 1455 944Q1448 958 1432 970Q1417 981 1389 981ZM2344 992Q2274 992 2224 969Q2173 946 2141 908Q2109 871 2094 825Q2078 779 2078 733Q2078 658 2112 600Q2146 542 2206 508Q2266 475 2344 475Q2402 475 2444 494Q2487 512 2514 542Q2542 571 2556 605Q2569 639 2569 670Q2569 725 2542 752Q2516 778 2475 778H2237Q2239 804 2256 822Q2272 840 2297 850Q2322 860 2350 860Q2374 860 2392 858Q2410 855 2423 850Q2436 846 2447 842Q2458 837 2466 834Q2475 831 2483 830Q2498 829 2510 838Q2523 848 2533 867Q2540 878 2542 888Q2545 898 2545 908Q2545 932 2520 951Q2496 970 2452 981Q2407 992 2344 992ZM2237 696H2395Q2411 696 2418 690Q2426 685 2426 669Q2426 651 2415 638Q2404 624 2386 616Q2367 609 2343 609Q2312 609 2288 621Q2264 633 2250 653Q2237 673 2237 696ZM2825 983Q2784 983 2752 978Q2721 974 2698 962Q2676 950 2662 929Q2648 908 2642 874Q2635 841 2635 792V330Q2635 310 2638 293Q2642 276 2658 265Q2674 254 2710 254Q2746 254 2762 265Q2777 276 2781 293Q2785 310 2785 330V785Q2785 801 2786 812Q2788 822 2792 828Q2797 834 2805 836Q2813 838 2826 838Q2838 838 2850 841Q2863 844 2872 859Q2881 874 2881 909Q2881 945 2872 961Q2863 977 2850 980Q2838 983 2825 983ZM3126 983Q3085 983 3054 978Q3022 974 3000 962Q2977 950 2963 929Q2949 908 2942 874Q2936 841 2936 792V330Q2936 310 2940 293Q2943 276 2959 265Q2975 254 3011 254Q3047 254 3062 265Q3078 276 3082 293Q3086 310 3086 330V785Q3086 801 3088 812Q3089 822 3094 828Q3098 834 3106 836Q3114 838 3127 838Q3139 838 3152 841Q3164 844 3173 859Q3182 874 3182 909Q3182 945 3173 961Q3164 977 3152 980Q3139 983 3126 983Z'
const WM_ASC = 974
const K = 0.07571 // font units -> lockup units (cap height 53, icon 100)

export const STICKER_W = 364, STICKER_H = 100

// The app icon (Lewy's face close-up) as a dozen vector shapes, all kept inside
// the rounded square so no clip is needed. A clip and a CSS-moved group in the
// credit stopped every animation in the scene, and a pixel-perfect icon was too
// heavy (16 Nov); at credit size this reads the same.
// The real app icon (brand/app-icon-1024.png) at 40 x 40 pixels, 24 colours: about
// 585 strokes, corners rounded by leaving their pixels out (no clip). Hundreds, not
// the thousands that froze the scene; at sign size it shows the icon's own detail.
const ICON_PX = "<path stroke=\"#5b9f35\" d=\"M6 0h1m5 0h1M4 1h3m1 0h2m1 0h2m1 0h2m1 0h2M4 2h16m3 0h1M5 3h1m2 0h4m1 0h1m1 0h7m1 0h2m1 0h2m1 0h1M7 4h2m2 0h1m4 0h3m1 0h8m1 0h4M3 5h1m6 0h1m3 0h2m2 0h2m1 0h1m1 0h13M16 6h1m6 0h1m2 0h9M33 7h1M12 8h1M7 9h1m2 0h1m3 0h3M9 10h1m4 0h4M8 11h4m16 0h2M8 12h2m5 0h1m20 0h1M0 13h1m7 0h2m3 0h1m18 0h1m4 0h1M0 14h5m1 0h3m28 0h2M0 15h4m1 0h2m8 0h1m22 0h2M1 16h5m25 0h1m7 0h1M2 17h2m6 0h2m20 0h1m6 0h1M8 18h1M3 19h1m9 0h1m19 0h1M2 20h1M0 21h1m1 0h2m34 0h1M4 22h1m33 0h2M0 23h3m10 0h1M0 24h3m4 0h1M0 25h5m20 0h1M0 26h7M0 27h1m2 0h4m27 0h1M6 28h3m23 0h1m1 0h1M7 29h5m18 0h4M7 30h6m15 0h2m1 0h2M8 31h8m9 0h7M10 32h8m1 0h3m1 0h9M10 33h21M14 34h3m2 0h10m1 0h1M16 35h1m6 0h1m3 0h1\"/><path stroke=\"#90c631\" d=\"M7 0h5m1 0h12m1 0h2m2 0h1m1 0h1M7 1h1m2 0h1m2 0h1m2 0h1m2 0h17M20 2h3m1 0h8m1 0h4M22 3h1m2 0h1m2 0h1m1 0h8M28 4h1m4 0h6M20 5h1m15 0h1M17 6h3m2 0h1m12 0h1M15 7h7m2 0h1m1 0h1m5 0h1M6 8h1m6 0h11m2 0h1M0 9h1m10 0h3m3 0h8m1 0h4m4 0h3M0 10h1m9 0h4m4 0h9m5 0h7M0 11h4m1 0h3m4 0h13m8 0h7M0 12h8m2 0h5m1 0h10m6 0h4m1 0h3M1 13h7m2 0h3m1 0h10m10 0h3m1 0h2M5 14h1m3 0h15m9 0h4m2 0h1M4 15h1m2 0h8m1 0h9m8 0h5M6 16h19m8 0h6M5 17h4m3 0h14m8 0h5M4 18h4m6 0h12m9 0h5M4 19h3m7 0h11m10 0h5M3 20h4m8 0h10m10 0h5M1 21h1m2 0h3m8 0h1m1 0h5m13 0h3m1 0h1M0 22h4m1 0h2m8 0h1m19 0h3M3 23h2m29 0h6M3 24h2m1 0h1m27 0h3M5 25h1m21 0h1m5 0h4m1 0h1M7 26h1m5 0h1m14 0h12M9 27h1m1 0h4m12 0h7m1 0h5M10 28h6m9 0h7m1 0h1m4 0h2M12 29h10m1 0h7M13 30h15m2 0h1M16 31h9M18 32h1m3 0h1\"/><path stroke=\"#bedd42\" d=\"M25 0h1m2 0h2m1 0h1m1 0h1M32 2h1M2 5h1m34 0h1M4 6h1m15 0h2m14 0h1M0 7h4m1 0h1m16 0h2m3 0h5m2 0h6M0 8h5m19 0h2m1 0h13M1 9h5m19 0h1m4 0h4m3 0h3M1 10h7m23 0h1m7 0h1M4 11h1M37 24h3M37 25h1m1 0h1\"/><path stroke=\"#2f731a\" d=\"M3 2h1M2 3h2m3 0h1m4 0h1M2 4h5m2 0h2m1 0h4m3 0h1M4 5h6m1 0h3m2 0h2m4 0h1M5 6h11m8 0h2M6 7h1m1 0h6M7 8h2m1 0h1M9 9h1M0 17h2M0 18h4M0 19h3M0 20h2M1 27h2M0 28h2M33 30h1M8 32h2m22 0h1M9 33h1m21 0h1M9 34h2m1 0h2m3 0h2m12 0h1M9 35h6m9 0h2m2 0h1m2 0h1M9 36h4m13 0h6M9 37h2m18 0h3M29 38h3M31 39h1\"/><path stroke=\"#5b7133\" d=\"M4 3h1m1 0h1m7 0h1M1 4h1M14 7h1m10 0h1M11 8h1M8 10h1M26 12h1M25 13h1m2 0h2M26 14h1M0 16h1m28 0h2M4 17h1M12 18h1M7 20h1m5 0h1m19 0h1M13 21h1m19 0h1M13 22h1m9 0h1m3 0h1m5 0h1M7 23h1m7 0h1m4 0h1M25 24h1M8 25h1m6 0h1M7 31h1m24 0h1M8 33h1M11 34h1m17 0h1M15 35h1m10 0h1m2 0h2M13 36h1M11 37h1m15 0h1\"/><path stroke=\"#dff45c\" d=\"M1 5h1m36 0h1M0 6h4m33 0h3M4 7h1M5 8h1M6 9h1\"/><path stroke=\"#1c481a\" d=\"M7 7h1M9 8h1M8 9h1M33 31h1M32 33h1M1 34h1m30 0h1M1 35h2m29 0h2M2 36h2m28 0h3M3 37h3m2 0h1m19 0h1m3 0h4M4 38h3m1 0h2m22 0h1m1 0h2M6 39h3m21 0h1m1 0h2\"/><path stroke=\"#9de25e\" d=\"M27 10h4M25 11h2m4 0h2M24 13h1m8 0h1M24 14h1m3 0h3m1 0h1M25 15h8M25 16h3m4 0h1M26 17h1m6 0h1M13 18h1m12 0h1m7 0h1M25 19h1m8 0h1M14 20h1m10 0h1m8 0h1M14 21h1m1 0h1m5 0h5m7 0h1M14 22h1m3 0h4m4 0h1m7 0h1M6 23h1m7 0h1m11 0h1M13 24h2m11 0h2m5 0h1M7 25h1m5 0h2m11 0h1m1 0h5M8 26h1m3 0h1m1 0h1m10 0h3M10 27h1m4 0h1m9 0h2M16 28h1m7 0h1M22 29h1\"/><path stroke=\"#81a85d\" d=\"M27 11h1m2 0h1M25 14h1m1 0h1m3 0h1M28 16h1M9 17h1m17 0h1M33 18h1M7 19h1m18 0h1M26 20h1M16 22h2m4 0h1m2 0h1M5 23h1m21 0h1m5 0h1M5 24h1m22 0h1m3 0h1M6 25h1m5 0h1M9 26h3m3 0h1M7 27h2m15 0h1M9 28h1m13 0h1m13 0h1M38 29h2M39 30h1M17 35h1m4 0h1M25 36h1M10 38h1m17 0h1M9 39h1m19 0h1\"/><path stroke=\"#2d1510\" d=\"M27 12h4M27 13h1m3 0h1M28 17h1M9 18h2m17 0h2M8 19h1m18 0h3m2 0h1M9 20h1m17 0h6M8 21h4m16 0h5M8 22h5m16 0h4M9 23h4m3 0h2m4 0h2m4 0h1m1 0h1M9 24h2m5 0h2m4 0h3M9 25h2m11 0h3M23 26h1M33 38h1\"/><path stroke=\"#3b2f2d\" d=\"M31 12h1M30 13h1M11 18h1m15 0h1m4 0h1M30 19h1M10 20h1M7 21h1m19 0h1M7 22h1m16 0h1M18 23h2m1 0h1m3 0h1m6 0h1M12 24h1m2 0h1m13 0h3M11 25h1m5 0h1M24 26h1M23 27h1M0 31h1m33 0h1M0 32h2m31 0h2M0 33h4m29 0h3M2 34h3m28 0h3M3 35h3m28 0h2M4 36h4m27 0h3M6 37h2m28 0h1M7 38h1\"/><path stroke=\"#0a000a\" d=\"M26 13h1M29 17h1M9 19h1M8 20h1M12 21h1M28 22h1M8 23h1m15 0h1m4 0h1m1 0h1M8 24h1m2 0h1m6 0h4M16 25h1\"/><path stroke=\"#6e5f65\" d=\"M30 17h2M12 19h1M12 20h1\"/><path stroke=\"#c3bfbc\" d=\"M30 18h1M11 20h1M24 36h1M26 37h1\"/><path stroke=\"#ffffff\" d=\"M31 18h1M11 19h1M18 36h4M24 37h2\"/><path stroke=\"#416151\" d=\"M10 19h1M2 28h2M0 29h5m29 0h3M0 30h6m28 0h4M1 31h5m29 0h4M2 32h5m28 0h5M4 33h3m29 0h4M5 34h4m27 0h3M6 35h3m27 0h3M8 36h1\"/><path stroke=\"#638474\" d=\"M31 19h1M4 28h2m29 0h2M5 29h2m30 0h1M6 30h1m31 0h1M6 31h1m32 0h1M7 32h1M7 33h1\"/><path stroke=\"#823837\" d=\"M18 25h1m1 0h2M16 26h1\"/><path stroke=\"#ba6865\" d=\"M19 25h1M22 26h1M18 28h1\"/><path stroke=\"#ee6369\" d=\"M17 26h1M17 27h1M19 28h3\"/><path stroke=\"#ff7f8d\" d=\"M18 26h4M18 27h5\"/><path stroke=\"#b0a65a\" d=\"M16 27h1M17 28h1m4 0h1\"/><path stroke=\"#a0b67d\" d=\"M18 35h4M14 36h1M12 37h1\"/><path stroke=\"#f4e1ca\" d=\"M15 36h3m4 0h2M13 37h11M11 38h17M10 39h19\"/>"

function appIcon(): string {
  return `<g transform="scale(2.5) translate(0 .5)" fill="none" stroke-width="1.04">${ICON_PX}</g>`
}

/** The lockup in its own STICKER_W x 100 box. */
export function sticker(): string {
  const tx = 100 + 22, baseline = 50 + 53 / 2
  const wm = (dx: number, dy: number) => `transform="translate(${tx + dx} ${(baseline - WM_ASC * K + dy).toFixed(1)}) scale(${K})"`
  return `<defs>` +
    `</defs>` +
    appIcon() +
    `<path d="${WORDMARK}" ${wm(0, 0)} fill="#27834B"/>`
}

/** LeWell as a wooden signpost standing in a scene (16 Nov): a post, a light pine board
 *  with the Lewy icon and wordmark, snow on top when `snowy`. Part of the world,
 *  so it scrolls past with its layer; static, light, no clip or CSS. (x, foot) is
 *  where the post meets the ground; `size` is the board's height in scene units. */
export function signpost(x: number, foot: number, size: number, snowy = false, night = false): string {
  const k = size / STICKER_H
  const bw = (STICKER_W + 40) * k, bh = size + 16 * k
  const bx = x - bw / 2, by = foot - size * 2.1
  const post = `<rect x="${(x - 5 * k * 1.6).toFixed(1)}" y="${(by + bh - 4).toFixed(1)}" width="${(16 * k).toFixed(1)}" height="${(foot - by - bh + 4).toFixed(1)}" fill="#5a3a22"/>`
  const board = `<rect x="${(bx - 6 * k).toFixed(1)}" y="${(by - 6 * k).toFixed(1)}" width="${(bw + 12 * k).toFixed(1)}" height="${(bh + 12 * k).toFixed(1)}" rx="${(10 * k).toFixed(1)}" fill="#6b4428"/>` +
    `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="${(6 * k).toFixed(1)}" fill="${night ? 'url(#signLit)' : '#dcae72'}"/>` +
    // a few planks of light pine: grain lines across the board
    [0.3, 0.62, 0.86].map(f => `<rect x="${(bx + 4 * k).toFixed(1)}" y="${(by + bh * f).toFixed(1)}" width="${(bw - 8 * k).toFixed(1)}" height="${(2.2 * k).toFixed(1)}" fill="#c9965a" opacity=".7"/>`).join('')
  const snow = snowy ? `<path d="M${(bx - 8 * k).toFixed(1)} ${(by - 4 * k).toFixed(1)}q${(bw * 0.25).toFixed(1)} ${(-16 * k).toFixed(1)} ${(bw * 0.5 + 8 * k).toFixed(1)} ${(-10 * k).toFixed(1)}t${(bw * 0.5 + 8 * k).toFixed(1)} ${(6 * k).toFixed(1)}v${(8 * k).toFixed(1)}h${(-(bw + 16 * k)).toFixed(1)}z" fill="#dfe6f6"/>` : ''
  const face = `<g transform="translate(${(bx + 20 * k).toFixed(1)} ${(by + 8 * k).toFixed(1)}) scale(${k.toFixed(4)})">${sticker()}</g>`
  if (!night) return post + board + face + snow
  // night: dark wood lit by a string of Christmas lights around the board, the
  // glow warmest behind the name (the scene's own twinkle classes li0/li1)
  const lit = `<defs><radialGradient id="signLit" cx=".5" cy=".5" r=".62"><stop offset="0" stop-color="#d49a5c"/><stop offset=".55" stop-color="#a06a3a"/><stop offset="1" stop-color="#5a3a22"/></radialGradient></defs>`
  const glow = `<ellipse cx="${x.toFixed(1)}" cy="${(by + bh / 2).toFixed(1)}" rx="${(bw * 0.8).toFixed(1)}" ry="${(bh * 1.6).toFixed(1)}" fill="url(#warm)" class="gl"/>`
  const colours = ['#ff4a4a', '#ffd25a', '#5fd38a', '#6ab0ff']
  const b = 6 // the same size as the village's other bulbs
  const sets = ['', '', '', '']
  let n = 0
  const left = bx - 6 * k, right = bx + bw + 6 * k, top = by - 6 * k, bottom = by + bh + 6 * k
  for (let t = 0; t <= 1.0001; t += 0.1) { const px = left + (right - left) * t; sets[n++ % 4] += `M${(px - b / 2).toFixed(1)} ${(top - b / 2).toFixed(1)}h${b.toFixed(1)}v${b.toFixed(1)}h${(-b).toFixed(1)}z`; sets[n++ % 4] += `M${(px - b / 2).toFixed(1)} ${(bottom - b / 2).toFixed(1)}h${b.toFixed(1)}v${b.toFixed(1)}h${(-b).toFixed(1)}z` }
  const bulbs = sets.map((d, i) => `<path class="li li${i % 2}" d="${d}" fill="${colours[i]}"/>`).join('')
  return lit + glow + post + board + face + snow + bulbs
}
