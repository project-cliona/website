type SwitchProps = {
  enabled: boolean;
  onChange: (value: boolean) => void;
};

export function Switch({ enabled, onChange }: SwitchProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`w-10 h-5 flex items-center rounded-full p-1 transition ${
        enabled ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
          enabled ? 'translate-x-5' : ''
        }`}
      />
    </button>
  );
}