interface ScreenCaptureProps {
  onCapture: (image: string) => void;
}

export function ScreenCapture({ onCapture }: ScreenCaptureProps) {
  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always",
        },
        audio: false,
      });

      const video = document.createElement("video");
      video.srcObject = stream;
      video.autoplay = true;

      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0);

      const dataUrl = canvas.toDataURL("image/png");

      // Stop all tracks
      stream.getTracks().forEach((track) => track.stop());

      onCapture(dataUrl);
    } catch (error) {
      console.error("Screen capture failed:", error);
      alert("ไม่สามารถจับภาพหน้าจอได้ กรุณาลองใหม่");
    }
  };

  return (
    <button
      onClick={handleCapture}
      className="w-full bg-[#ffd700] text-[#1a1a2e] font-bold text-lg px-6 py-4 rounded-xl
                 hover:bg-[#ffea00] hover:scale-[1.02] transition-all duration-200
                 focus-visible:outline-none flex items-center justify-center gap-2"
      aria-label="จับภาพหน้าจอและตรวจจับสกิลอัตโนมัติ"
    >
      <span className="text-2xl">📸</span>
      <span>จับภาพหน้าจอ - ตรวจจับอัตโนมัติ</span>
    </button>
  );
}