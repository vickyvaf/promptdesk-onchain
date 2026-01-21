import { SettingsModal } from "./SettingsModal";

interface PlatformSelectorProps {
  selected: string;
  onSelect: (platform: string) => void;
  systemInstructions: Record<string, string>;
  setSystemInstructions: (instructions: Record<string, string>) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  selectedPlatform: string;
  onSaveInstruction?: (platform: string, instruction: string) => void;
  connectedPlatforms?: string[];
  connectedUsernames?: Record<string, string>;
  onDisconnect?: (platform: string) => void;
}

const platforms = [
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6"
      >
        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.6.6 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
      </svg>
    ),
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
        />
      </svg>
    ),
  },
  {
    id: "threads",
    label: "Threads",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6"
      >
        <path
          fillRule="evenodd"
          d="M12.75 9.176A3.004 3.004 0 009.68 12a3.004 3.004 0 003.076 2.824c.776 0 1.488-.308 2-.806v.774c0 1.487-1.168 2.032-2.122 2.032-1.928 0-2.828-1.3-2.828-3.056V11.2a7.614 7.614 0 017.584-7.643c4.276 0 7.576 3.4 7.576 7.683 0 4.604-3.528 7.76-8.24 7.76-4.632 0-7.892-3.112-7.892-7.66C8.832 6.58 11.996 3.5 16.036 3.5c1.676 0 3.208.544 4.384 1.464l1.1-1.38A8.832 8.832 0 0016.036 1.7C10.968 1.7 6.94 5.568 6.94 11.34c0 5.688 4.096 9.46 9.696 9.46 5.864 0 10.24-3.876 10.24-9.56 0-5.188-4.1-9.38-9.332-9.38-5.152 0-9.284 4.076-9.284 9.336 0 2.664.996 4.968 4.416 4.968 2.924 0 3.824-2.108 3.824-3.72v-1.124a4.708 4.708 0 01-3.75 1.796zm.132-5.748c1.692 0 2.9.992 2.9 2.88 0 1.832-1.208 2.82-2.9 2.82-1.748 0-2.956-1.024-2.956-2.82 0-1.744 1.18-2.88 2.956-2.88z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    id: "twitter",
    label: "Twitter",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export function PlatformSelector({
  selected,
  onSelect,
  systemInstructions,
  setSystemInstructions,
  isSettingsOpen,
  setIsSettingsOpen,
  selectedPlatform,
  onSaveInstruction,
  connectedPlatforms = [],
  connectedUsernames = {},
  onDisconnect,
}: PlatformSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Target Platform
        </label>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        value={systemInstructions[selectedPlatform]}
        onChange={(newValue) =>
          // @ts-ignore
          setSystemInstructions((prev) => ({
            ...prev,
            [selectedPlatform]: newValue,
          }))
        }
        onSave={() => {
          if (onSaveInstruction) {
            onSaveInstruction(
              selectedPlatform,
              systemInstructions[selectedPlatform],
            );
          }
        }}
        platform={selectedPlatform}
      />
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 mt-3">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => onSelect(platform.id)}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 relative group ${
              selected === platform.id
                ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
                : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black"
            }`}
          >
            {connectedPlatforms.includes(platform.id) && (
              <div className="absolute top-2 right-2 z-10 flex gap-1">
                {onDisconnect && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onDisconnect(platform.id);
                    }}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors cursor-pointer"
                    title="Disconnect"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-3 w-3"
                    >
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </div>
                )}
              </div>
            )}
            <div
              className={`${
                selected === platform.id ? "text-blue-500" : "text-zinc-500"
              }`}
            >
              {platform.icon}
            </div>
            <span
              className={`text-xs font-semibold ${
                selected === platform.id ? "text-blue-600" : "text-zinc-500"
              }`}
            >
              {platform.label}
            </span>
            {connectedUsernames[platform.id] && (
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                @{connectedUsernames[platform.id]}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
