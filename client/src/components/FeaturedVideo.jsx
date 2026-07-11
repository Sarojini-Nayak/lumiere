import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const FeaturedVideo = () => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const toggleMute = () => {
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  return (
    <section className="relative w-full h-[70vh] md:h-screen overflow-hidden bg-noir">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        src="https://www.w3schools.com/html/mov_bbb.mp4"
      />
      <div className="absolute inset-0 bg-noir/30" />

      <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-14">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-md"
        >
          <span className="text-champagne text-[12px] tracking-[0.3em] uppercase font-body">
            The Film
          </span>
          <h2 className="font-heading text-ivory text-3xl md:text-5xl mt-4 leading-tight">
            The Making of Lumière
          </h2>
        </motion.div>

        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            aria-label={playing ? "Pause video" : "Play video"}
            className="w-12 h-12 rounded-full bg-ivory/90 backdrop-blur-sm flex items-center justify-center hover:bg-ivory transition-colors"
          >
            {playing ? (
              <Pause size={16} strokeWidth={1.5} className="text-noir" />
            ) : (
              <Play size={16} strokeWidth={1.5} className="text-noir ml-0.5" />
            )}
          </button>
          <button
            onClick={toggleMute}
            aria-label={muted ? "Unmute video" : "Mute video"}
            className="w-12 h-12 rounded-full border border-ivory/40 flex items-center justify-center text-ivory hover:bg-ivory/10 transition-colors"
          >
            {muted ? (
              <VolumeX size={16} strokeWidth={1.5} />
            ) : (
              <Volume2 size={16} strokeWidth={1.5} />
            )}
          </button>
          <span className="text-ivory/60 text-[12px] tracking-[0.1em] uppercase font-body ml-2">
            02:14 — Behind the Bench
          </span>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVideo;
