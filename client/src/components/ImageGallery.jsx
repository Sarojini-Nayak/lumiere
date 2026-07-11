import { useState, useRef } from "react";
import { Play, RotateCw } from "lucide-react";

const ImageGallery = ({ images, video }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState("image");
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState("50% 50%");
  const [rotateMode, setRotateMode] = useState(false);
  const dragState = useRef({ dragging: false, startX: 0 });

  const gallery = images && images.length > 0 ? images : [{ url: "" }];
  const activeImage = gallery[activeIndex]?.url;

  const handleMouseMove = (e) => {
    if (rotateMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos(`${x}% ${y}%`);
  };

  const handleMouseDown = (e) => {
    if (!rotateMode) return;
    dragState.current = { dragging: true, startX: e.clientX };
  };

  const handleDragMove = (e) => {
    if (!rotateMode || !dragState.current.dragging) return;
    const delta = e.clientX - dragState.current.startX;
    if (Math.abs(delta) > 45) {
      setActiveIndex((prev) => {
        const dir = delta > 0 ? -1 : 1;
        return (prev + dir + gallery.length) % gallery.length;
      });
      dragState.current.startX = e.clientX;
    }
  };

  const stopDrag = () => {
    dragState.current.dragging = false;
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible md:w-20 shrink-0">
        {gallery.map((img, i) => (
          <button
            key={i}
            onClick={() => {
              setMode("image");
              setActiveIndex(i);
            }}
            className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-luxury overflow-hidden border transition-colors ${
              mode === "image" && activeIndex === i ? "border-champagne" : "border-transparent"
            }`}
          >
            <img src={img.url} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
        {video && (
          <button
            onClick={() => setMode("video")}
            className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-luxury overflow-hidden border relative bg-noir flex items-center justify-center ${
              mode === "video" ? "border-champagne" : "border-transparent"
            }`}
            aria-label="Play product video"
          >
            <Play size={18} strokeWidth={1.5} className="text-ivory" />
          </button>
        )}
      </div>

      <div className="flex-1">
        <div className="relative rounded-luxury overflow-hidden bg-white aspect-square">
          {mode === "video" ? (
            <video src={video} controls className="w-full h-full object-cover" />
          ) : (
            <div
              onMouseMove={(e) => {
                handleMouseMove(e);
                handleDragMove(e);
              }}
              onMouseEnter={() => !rotateMode && setIsZooming(true)}
              onMouseLeave={() => {
                setIsZooming(false);
                stopDrag();
              }}
              onMouseDown={handleMouseDown}
              onMouseUp={stopDrag}
              className={
                rotateMode ? "w-full h-full cursor-grab active:cursor-grabbing" : "w-full h-full cursor-zoom-in"
              }
              style={{
                backgroundImage: `url(${activeImage})`,
                backgroundPosition: isZooming ? zoomPos : "50% 50%",
                backgroundSize: isZooming ? "180%" : "100%",
                backgroundRepeat: "no-repeat",
                transition: "background-size 0.3s ease",
              }}
            />
          )}

          {gallery.length > 1 && (
            <button
              onClick={() => setRotateMode(!rotateMode)}
              className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-body tracking-wide uppercase transition-colors ${
                rotateMode ? "bg-champagne text-noir" : "bg-ivory/90 text-noir/70"
              }`}
            >
              <RotateCw size={12} strokeWidth={1.5} />
              360°
            </button>
          )}
        </div>
        {rotateMode && (
          <p className="text-center text-noir/40 text-[11px] font-body mt-2 tracking-wide">
            Click and drag to rotate
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
