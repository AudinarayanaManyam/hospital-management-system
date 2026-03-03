import { ShieldOff, ArrowLeft } from 'lucide-react';

interface Props {
  resource?: string;
  onBack?: () => void;
}

export default function AccessDenied({ resource, onBack }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 rounded-3xl bg-red-100 flex items-center justify-center mb-6">
        <ShieldOff className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
      <p className="text-gray-500 mb-1 max-w-sm">
        You don't have permission to access{resource ? ` <strong>${resource}</strong>` : ' this module'}.
      </p>
      <p className="text-sm text-gray-400 mb-6">Contact your administrator if you believe this is an error.</p>
      {onBack && (
        <button onClick={onBack} className="btn-secondary">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      )}
    </div>
  );
}
