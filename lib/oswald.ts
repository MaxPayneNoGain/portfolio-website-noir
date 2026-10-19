// next/og can't read woff2, so this asks google fonts for a ttf with just the letters we draw
export async function oswald(weight: number, text: string) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Oswald:wght@${weight}&text=${encodeURIComponent(text)}`,
  ).then((res) => res.text())
  const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1]
  if (!url) throw new Error("Couldn't load Oswald")
  return fetch(url).then((res) => res.arrayBuffer())
}
