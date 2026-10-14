// Turns a stored video_url into something the site can render.
// Supports YouTube, Vimeo, Google Drive share links, and direct video files.

function driveId(url) {
  const m = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?.*id=)([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
}

function youtubeId(url) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}

function vimeoId(url) {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

export function detectVideoSource(url) {
  if (!url) return 'youtube';
  if (youtubeId(url)) return 'youtube';
  if (vimeoId(url)) return 'vimeo';
  if (driveId(url)) return 'drive';
  return 'upload';
}

// { kind: 'iframe' | 'file', src, thumbnail }
export function getVideoEmbed(url) {
  if (!url) return null;
  const yt = youtubeId(url);
  if (yt) return { kind: 'iframe', src: `https://www.youtube.com/embed/${yt}`, thumbnail: `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` };
  const vm = vimeoId(url);
  if (vm) return { kind: 'iframe', src: `https://player.vimeo.com/video/${vm}`, thumbnail: null };
  const dr = driveId(url);
  // Drive's thumbnail endpoint rate-limits browsers, so Drive videos get no thumbnail
  if (dr) return { kind: 'iframe', src: `https://drive.google.com/file/d/${dr}/preview`, thumbnail: null };
  return { kind: 'file', src: url, thumbnail: null };
}

export function formatDuration(seconds) {
  if (!seconds) return null;
  return `${Math.round(seconds / 60)} min`;
}
