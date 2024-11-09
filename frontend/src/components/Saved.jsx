export const Saved = () => {
  return (
    <div class=" rounded-md p-3 flex w-full">
      <svg
        class="stroke-2 stroke-current text-green-600 h-8 w-8 mr-2 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M0 0h24v24H0z" stroke="none" />
        <circle cx="12" cy="12" r="9" />
        <path d="M9 12l2 2 4-4" />
      </svg>

      <div class="text-green-700 text-end">
        <div class="font-bold text-xl">Saved!</div>
      </div>
    </div>
  );
};
