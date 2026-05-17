import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <h1 className="text-5xl md:text-6xl font-bold text-center mb-8 text-[#ffd700] drop-shadow-[0_0_20px_rgba(255,200,100,0.5)]">
        7K Skill Planner
      </h1>

      {/* Intro section */}
      <div className="text-center mb-12">
        <p className="text-xl md:text-2xl text-gray-200 mb-4">
          เครื่องมือวางแผนสกิลสำหรับเกม Seven Knights
        </p>
        <p className="text-lg text-gray-300">
          จับภาพหน้าจอ ตรวจจับอัตโนมัติ เลือกสกิล และแชร์ build ของคุณ
        </p>
      </div>

      {/* CTA Button */}
      <div className="flex justify-center mb-12">
        <Link
          href="/planner"
          className="bg-[#ffd700] text-[#1a1a2e] font-bold text-xl px-8 py-4 rounded-xl
                     hover:bg-[#ffea00] hover:scale-105 transition-all duration-200
                     focus-visible:outline-none"
        >
          🚀 เริ่มใช้งาน
        </Link>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#16213e] p-6 rounded-xl border border-[#0f3460]">
          <div className="text-4xl mb-4">📸</div>
          <h3 className="text-xl font-bold text-[#ffd700] mb-2">จับภาพอัตโนมัติ</h3>
          <p className="text-gray-300">จับภาพหน้าจอเกมและตรวจจับสกิล 10 ตัวใน grid 2×5 อัตโนมัติ</p>
        </div>

        <div className="bg-[#16213e] p-6 rounded-xl border border-[#0f3460]">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-[#ffd700] mb-2">เลือกและจัดลำดับ</h3>
          <p className="text-gray-300">คลิกเพื่อเลือกสกิล (ซ้ำได้) และลากเพื่อจัดลำดับตามที่ต้องการ</p>
        </div>

        <div className="bg-[#16213e] p-6 rounded-xl border border-[#0f3460]">
          <div className="text-4xl mb-4">📥</div>
          <h3 className="text-xl font-bold text-[#ffd700] mb-2">ดาวน์โหลดและแชร์</h3>
          <p className="text-gray-300">สร้างรูป build สวยๆ พร้อมดาวน์โหลดหรือคัดลอกไปคลิปบอร์ดทันที</p>
        </div>
      </div>

      {/* Example images */}
      <div className="bg-[#16213e] p-6 rounded-xl border border-[#0f3460]">
        <h3 className="text-2xl font-bold text-[#ffd700] mb-4 text-center">ตัวอย่างการใช้งาน</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-300 mb-2">1. หน้าจอเลือกสกิล (Older Skill)</p>
            <img src="/Example.png" alt="ตัวอย่าง" className="rounded-lg w-full" />
          </div>
          <div>
            <p className="text-gray-300 mb-2">2. ผลลัพธ์ที่ได้</p>
            <img src="/Finish.png" alt="ผลลัพธ์" className="rounded-lg w-full" />
          </div>
        </div>
      </div>

      {/* Credit */}
      <div className="text-center mt-12 text-gray-400">
        <p>Created by snowb4ll</p>
      </div>
    </div>
  );
}