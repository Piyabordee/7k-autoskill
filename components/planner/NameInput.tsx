interface NameInputProps {
  value: string;
  onChange: (name: string) => void;
}

export function NameInput({ value, onChange }: NameInputProps) {
  return (
    <div className="mb-6">
      <label
        htmlFor="skillName"
        className="block text-lg font-bold mb-2 text-[#ffd700]"
      >
        ชื่อตัวละคร
      </label>
      <input
        id="skillName"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ระบุชื่อ เช่น น่องไก้, ไคล์, แทโอ"
        className="w-full px-4 py-3 bg-[#16213e] border-2 border-[#0f3460] rounded-lg
                   text-white placeholder-gray-400
                   focus:border-[#ffd700] focus:outline-none transition-colors"
        maxLength={50}
        aria-label="ชื่อตัวละคร"
      />
    </div>
  );
}