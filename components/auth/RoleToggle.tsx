interface RoleToggleProps {
  role: 'candidate' | 'recruiter';
  setRole: (role: 'candidate' | 'recruiter') => void;
}

export default function RoleToggle({ role, setRole }: RoleToggleProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex rounded-full p-1 bg-[var(--neutral-100)]">
        <button
          type="button"
          onClick={() => setRole('candidate')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            role === 'candidate'
              ? 'bg-[var(--primary-500)] text-white shadow-md'
              : 'text-[color:var(--neutral-600)] hover:text-[color:var(--neutral-800)]'
          }`}
        >
          Candidate
        </button>
        <button
          type="button"
          onClick={() => setRole('recruiter')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            role === 'recruiter'
              ? 'bg-[var(--secondary-500)] text-white shadow-md'
              : 'text-[color:var(--neutral-600)] hover:text-[color:var(--neutral-800)]'
          }`}
        >
          Recruiter
        </button>
      </div>
    </div>
  );
}
