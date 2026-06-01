export function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div className="overflow-hidden rounded-3xl border bg-black shadow-sm">
      <iframe
        className="aspect-video w-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
