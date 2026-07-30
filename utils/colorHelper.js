/**
 * Utility helper to map Indonesian & English cat coat color names to valid CSS styles.
 * Fixes missing colors for "Oranye", "Oren", "Hitam", "Putih", "Abu-abu", "Cokelat", "Calico", etc.
 */
export const getCatColorStyle = (color) => {
  if (!color) return { backgroundColor: '#cbd5e1' };
  const c = color.toString().toLowerCase().trim();

  // Oranye / Oren / Orange
  if (c.includes('oran') || c.includes('oren') || c.includes('amber') || c.includes('ginger')) {
    return { backgroundColor: '#f97316' };
  }
  // Hitam / Black / Dark
  if (c.includes('hitam') || c.includes('black') || c.includes('gelap')) {
    return { backgroundColor: '#1e293b' };
  }
  // Putih / White
  if (c.includes('putih') || c.includes('white')) {
    return { backgroundColor: '#ffffff', border: '1px solid #cbd5e1' };
  }
  // Abu-abu / Gray / Grey / Silver
  if (c.includes('abu') || c.includes('grey') || c.includes('gray') || c.includes('silver')) {
    return { backgroundColor: '#64748b' };
  }
  // Cokelat / Brown / Chocolate
  if (c.includes('cokel') || c.includes('cokl') || c.includes('brown') || c.includes('choco')) {
    return { backgroundColor: '#7c2d12' };
  }
  // Kuning / Yellow / Gold
  if (c.includes('kuning') || c.includes('yellow') || c.includes('gold')) {
    return { backgroundColor: '#eab308' };
  }
  // Krem / Cream / Beige
  if (c.includes('krem') || c.includes('cream') || c.includes('beige')) {
    return { backgroundColor: '#fef08a', border: '1px solid #fef08a' };
  }
  // Merah / Red
  if (c.includes('merah') || c.includes('red')) {
    return { backgroundColor: '#ef4444' };
  }
  // Belang 3 / Calico / Tricolor / 3 Warna
  if (c.includes('calico') || c.includes('belang') || c.includes('tricolor') || c.includes('3 warna') || c.includes('tiga warna')) {
    return { background: 'linear-gradient(135deg, #f97316 33%, #1e293b 33% 66%, #ffffff 66%)', border: '1px solid #cbd5e1' };
  }
  // Tortoiseshell / Tortie
  if (c.includes('tortie') || c.includes('tortoise')) {
    return { background: 'linear-gradient(135deg, #f97316 50%, #1e293b 50%)' };
  }

  // Fallback to standard color or slate dot
  return { backgroundColor: c };
};
